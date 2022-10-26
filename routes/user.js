const express = require("express");
const router = express.Router();

const userValidation = require("../validations/user.validation");
const registerController = require("../controllers/register");
const passwordController = require("../controllers/password");

router.post(
  "/signup",
  userValidation.signupValidation(),
  registerController.signup
);
router.get("/confirm/:confirmationCode", registerController.verifyUser);
router.post(
  "/recover",
  userValidation.forgotPasswordValidation(),
  passwordController.forgotPassword
);
router.post(
  "/auth/reset/:token",
  userValidation.resetPasswordValidation(),
  passwordController.resetPassword
);

module.exports = router;
