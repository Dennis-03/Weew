const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const userAuth = require("../middleware/userauth");

const User = require("../models/users");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

router.post("/register", (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const phone = req.body.phone;
  const username = req.body.username;
  const email = req.body.email;
  const pwd = req.body.password;
  const password = bcrypt.hashSync(pwd, salt);

  User.find({ phone: phone }).then((user) => {
    if (user.length >= 1) {
      return res.status(400).json({ status: "User exist" });
    }
  });
  if (phone) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      })
      .then((data) => {
        const newUser = new User({
          username,
          email,
          phone,
          password,
        });

        newUser
          .save()
          .then(() => {
            res.status(200).json({
              status: "User Created",
              message: "Verification is sent!!",
              phone: phone,
              data,
            });
          })
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => {
        res.status(400).json({ Error: err });
      });
  } else {
    res.status(400).json({
      message: "Wrong phone number :(",
      phone: phone,
      data,
    });
    // push user
  }
});

// Verify Endpoint
router.post("/verify", async (req, res) => {
  const phone = req.body.phone;
  const code = req.body.code;
  if (phone && code.length === 6) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: code,
      })
      .then((data) => {
        if (data.status === "approved") {
          update(phone);
          res.status(200).json({
            message: "User is Verified!! And can login",
            data,
          });
          console.log("Verified");
        } else {
          res.status(400).json({
            message: "Wrong phone number or code :(",
            phone: phone,
          });
        }
      })
      .catch((err) => {
        res.status(400).json({ Error: err });
      });
  } else {
    res.status(400).json({
      message: "Wrong phone number or code :(",
      phone: phone,
    });
  }
});

router.post("/login", (req, res, next) => {
  User.find({ phone: req.body.phone })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        if (user[0].verified == false) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              phone: user[0].phone,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

async function update(phone) {
  await User.findOneAndUpdate(
    { phone: phone },
    {
      verified: true,
    },
    { new: true }
  );
}

router.get("/details", userAuth, (req, res) => {
  res.send("Success");
});

module.exports = router;
