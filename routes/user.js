const express = require("express");
const router = express.Router();

// cfg.accountSid = process.env.TWILIO_ACCOUNT_SID;
// cfg.authToken = process.env.TWILIO_AUTH_TOKEN;

// UserSchema.methods.sendAuthyToken = function (cb) {
//   var self = this;

//   if (!self.authyId) {
//     // Register this user if it's a new user
//     authy.register_user(self.email, self.phone, self.countryCode, function (
//       err,
//       response
//     ) {
//       if (err || !response.user) return cb.call(self, err);
//       self.authyId = response.user.id;
//       self.save(function (err, doc) {
//         if (err || !doc) return cb.call(self, err);
//         self = doc;
//         sendToken();
//       });
//     });
//   } else {
//     // Otherwise send token to a known user
//     sendToken();
//   }

//   // With a valid Authy ID, send the 2FA token for this user
//   function sendToken() {
//     authy.request_sms(self.authyId, true, function (err, response) {
//       cb.call(self, err);
//     });
//   }
// };

// exports.verify = function (request, response) {
//   let user = {};

//   // Load user model
//   User.findById(request.params.id, function (err, doc) {
//     if (err || !doc) {
//       return die("User not found for this ID.");
//     }

//     // If we find the user, let's validate the token they entered
//     user = doc;
//     user.verifyAuthyToken(request.body.code, postVerify);
//   });

//   // Handle verification response
//   function postVerify(err) {
//     if (err) {
//       return die("The token you entered was invalid - please retry.");
//     }

//     // If the token was valid, flip the bit to validate the user account
//     user.verified = true;
//     user.save(postSave);
//   }

//   // after we save the user, handle sending a confirmation
//   function postSave(err) {
//     if (err) {
//       return die(
//         "There was a problem validating your account " +
//           "- please enter your token again."
//       );
//     }

//     // Send confirmation text message
//     const message = "You did it! Signup complete :)";
//     user.sendMessage(
//       message,
//       function () {
//         // show success page
//         request.flash("successes", message);
//         response.redirect(`/users/${user._id}`);
//       },
//       function (err) {
//         request.flash(
//           "errors",
//           "You are signed up, but " +
//             "we could not send you a message. Our bad :("
//         );
//       }
//     );
//   }

//   // respond with an error
//   function die(message) {
//     request.flash("errors", message);
//     response.redirect("/users/" + request.params.id + "/verify");
//   }
// };

// // Test a 2FA token
// UserSchema.methods.verifyAuthyToken = function (otp, cb) {
//   const self = this;
//   authy.verify(self.authyId, otp, function (err, response) {
//     cb.call(self, err, response);
//   });
// };

// // Resend a code if it was not received
// exports.resend = function (request, response) {
//   // Load user model
//   User.findById(request.params.id, function (err, user) {
//     if (err || !user) {
//       return die("User not found for this ID.");
//     }

//     // If we find the user, let's send them a new code
//     user.sendAuthyToken(postSend);
//   });

//   // Handle send code response
//   function postSend(err) {
//     if (err) {
//       return die(
//         "There was a problem sending you the code - please " + "retry."
//       );
//     }

//     request.flash("successes", "Code re-sent!");
//     response.redirect("/users/" + request.params.id + "/verify");
//   }

//   // respond with an error
//   function die(message) {
//     request.flash("errors", message);
//     response.redirect("/users/" + request.params.id + "/verify");
//   }
// };

// exports.showUser = function (request, response, next) {
//   // Load user model
//   User.findById(request.params.id, function (err, user) {
//     if (err || !user) {
//       // 404
//       return next();
//     }

//     response.render("users/show", {
//       title: "Hi there " + user.fullName + "!",
//       user: user,
//       // any errors
//       errors: request.flash("errors"),
//       // any success messages
//       successes: request.flash("successes"),
//     });
//   });
// };

// // Send a text message via twilio to this user
// UserSchema.methods.sendMessage = function (
//   message,
//   successCallback,
//   errorCallback
// ) {
//   const self = this;
//   const toNumber = `+${self.countryCode}${self.phone}`;

//   twilioClient.messages
//     .create({
//       to: toNumber,
//       from: config.twilioNumber,
//       body: message,
//     })
//     .then(function () {
//       successCallback();
//     })
//     .catch(function (err) {
//       errorCallback(err);
//     });
// };

// var messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);

// // Set up and configure the Express framework

// // Display page to ask the user for their phone number
// router.get("/", function (req, res) {
//   res.status(200).json({ msg: "Inittial" });
// });

// // Handle phone number submission
// router.post("/step2", function (req, res) {
//   var number = req.body.number;

//   // Make request to Verify API
//   messagebird.verify.create(
//     number,
//     {
//       originator: "Code",
//       template: "Your verification code is %token.",
//     },
//     function (err, response) {
//       if (err) {
//         // Request has failed
//         console.log(err);
//         res.status(400).json({ msg: err });
//       } else {
//         // Request was successful
//         console.log(response);
//         res.status(200).json({ msg: "step2" });
//       }
//     }
//   );
// });

// // Verify whether the token is correct
// router.post("/step3", function (req, res) {
//   var id = req.body.id;
//   var token = req.body.token;

//   // Make request to Verify API
//   messagebird.verify.verify(id, token, function (err, response) {
//     if (err) {
//       // Verification has failed
//       console.log(err);
//       res.status(200).json({ msg: err });
//     } else {
//       // Verification was successful
//       console.log(response);
//       res.status(200).json({ msg: "step3" });
//     }
//   });
// });

// router.get("/prod", (req, res, next) => {
//   res.status(200).json({ msg: "dussted" });
// });

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

// /login
//     - phone number
//     - channel (sms/call)

// /verify
//     - phone number
//     - code

router.get("/", (req, res) => {
  res.status(200).send({
    message: "You are on Homepage",
    info: {
      login:
        "Send verification code through /login . It contains two params i.e. phonenumber and channel(sms/call)",
      verify:
        "Verify the recieved code through /verify . It contains two params i.e. phonenumber and code",
    },
  });
});

// Login Endpoint
router.post("/login", (req, res) => {
  if (req.body.phonenumber) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verifications.create({
        to: `+${req.body.phonenumber}`,
        channel: req.body.channel === "call" ? "call" : "sms",
      })
      .then((data) => {
        res.status(200).send({
          message: "Verification is sent!!",
          phonenumber: req.body.phonenumber,
          data,
        });
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number :(",
      phonenumber: req.query.phonenumber,
      data,
    });
  }
});

// Verify Endpoint
router.post("/verify", (req, res) => {
  if (req.body.phonenumber && req.body.code.length === 6) {
    client.verify
      .services(process.env.SERVICE_ID)
      .verificationChecks.create({
        to: `+${req.body.phonenumber}`,
        code: req.body.code,
      })
      .then((data) => {
        if (data.status === "approved") {
          res.status(200).send({
            message: "User is Verified!!",
            data,
          });
        }
      });
  } else {
    res.status(400).send({
      message: "Wrong phone number or code :(",
      phonenumber: req.body.phonenumber,
    });
  }
});

module.exports = router;
