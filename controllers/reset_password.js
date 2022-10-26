const nodemailer = require("../config/nodemailer");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

exports.forgotPassword = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user)
          return res.status(401).json({
            message:
              "The email address " +
              req.body.email +
              " is not associated with any account. Double-check your email address and try again.",
          });
        user.generateResetToken();
        user
          .save()
          .then((user) => {
            // send email
            const url =
              "http://" +
              req.headers.host +
              "/api/auth/reset/" +
              user.resetPasswordToken;
            const subject = "Forgot password";
            const body = `Hi ${user.username} \n 
                    Please click on the following link ${url} to reset your password.\n 
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`;
            nodemailer.sendMail(user, subject, body);
          })
          .then(() => {
            res.status(200).json({ message: "an email has been sent to you!" });
          })
          .catch((err) => res.status(500).json({ message: err.message }));
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    })
      .then((user) => {
        if (!user)
          res.status(401).json({
            message: "Password reset token is invalid or has expired.",
          });

        bcrypt
          .hash(req.body.password, 10)
          .then((hash) => {
            user.password = hash;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save().then(() => {
              const subject = "Password Reset";
              const body = `Hi ${user.username} \n 
             This is a confirmation that the password for your account ${user.email} has just been changed.\n`;
              nodemailer.sendMail(user, subject, body);
              res.status(200).json({
                message: "Your password has been successfully updated!",
              });
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } catch (error) {
    next(error);
  }
};
