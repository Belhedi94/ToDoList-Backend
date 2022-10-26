require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("../config/nodemailer");
const fs = require("fs");

exports.signup = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const token = jwt.sign({ email: req.body.email }, process.env.SECRET);
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: hash,
          confirmationCode: token,
          image: req.file ? req.file.filename : `no-image.jpeg`,
        });
        user
          .save()
          .then(() =>
            res.status(201).json({
              message: "User created successfully, please check your email!",
            })
          )
          .catch((error) => res.status(400).json({ error }));
        const subject = "Account Confirmation";
        const body = `<h1>Email Confirmation</h1>
        <h2>Hello ${user.username}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on this</p>
        <a href=http://localhost:3000/api/confirm/${user.confirmationCode}>link</a>
        </div>`;
        nodemailer.sendMail(user, subject, body);
      })
      .catch((error) => res.status(500).json({ error }));
  } catch (err) {
    next(err);
  }
};

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "User Not found." });
      }

      user.active = true;
      user.emailConfirmedAt = Date.now();
      user.confirmationCode = undefined;
      user
        .save()
        .then(() =>
          res.status(200).json({ message: "User confirmed successfully!" })
        )
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
