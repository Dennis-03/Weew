const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const salt = bcrypt.genSaltSync(10);

const User = require("../models/users");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

// router.get("/", (req, res) => {
//   res.status(200).send({
//     message: "You are on Homepage",
//     info: {
//       login:
//         "Send verification code through /login . It contains two params i.e. phone and channel(sms/call)",
//       verify:
//         "Verify the recieved code through /verify . It contains two params i.e. phone and code",
//     },
//   });
// });
router.post("/register", (req, res) => {
  const phone = req.body.phone;
  const username = req.body.username;
  const email = req.body.email;
  const pwd = req.body.password;
  const password = bcrypt.hashSync(pwd, salt);

  User.find({ phone: phone }).then((user) => {
    if (user.length >= 1) {
      res.status(400).json({ status: "User exist" });
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
        res.status(200).json({
          message: "Verification is sent!!",
          phone: phone,
          data,
        });
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
            message: "User is Verified!!",
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

router.post("/login", (req, res) => {
  res.status(200).json({ msg: "login" });
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

module.exports = router;
