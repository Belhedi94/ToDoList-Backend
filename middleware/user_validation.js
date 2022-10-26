const { body } = require("express-validator");
const User = require("../models/User");

module.exports = {
  signupValidation: () => {
    return [
      body("firstName")
        .exists({ checkFalsy: true })
        .withMessage("The first name field is required")
        .isAlpha()
        .withMessage("The first name should be valid"),
      body("lastName")
        .exists({ checkFalsy: true })
        .withMessage("The last name field is required")
        .isAlpha()
        .withMessage("The last name should be valid"),
      body("username")
        .exists({ checkFalsy: true })
        .withMessage("Username field is required")
        .isString()
        .withMessage("Username should be a string")
        .custom((username) => {
          return User.findOne({ username }).then((user) => {
            if (user) return Promise.reject("Username already in use");
          });
        }),
      body("password")
        .exists({ checkFalsy: true })
        .isStrongPassword()
        .withMessage("The password should be strong"),
      body("passwordConfirmation").custom((passwordConfirmation, { req }) => {
        if (passwordConfirmation !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
      body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email field is required")
        .isEmail()
        .withMessage("The email field should be a valid email address"),
      body("email").custom((email) => {
        return User.findOne({ email }).then((user) => {
          if (user) {
            return Promise.reject("E-mail already in use");
          }
        });
      }),
    ];
  },
  forgotPasswordValidation: () => {
    return [
      body("email")
        .exists({ checkFalsy: true })
        .withMessage("Email field is required")
        .isEmail()
        .withMessage("The email field should be a valid email address"),
    ];
  },
  resetPasswordValidation: () => {
    return [
      body("password")
        .exists({ checkFalsy: true })
        .isStrongPassword()
        .withMessage("The password should be strong"),
      body("passwordConfirmation")
        .exists({ checkFalsy: true })
        .withMessage("The password confirmation field is required")
        .custom((passwordConfirmation, { req }) => {
          if (passwordConfirmation !== req.body.password) {
            throw new Error("Password confirmation does not match password");
          }
          return true;
        }),
    ];
  },
};
