const express = require("express");
const router = express.Router();

const userValidation = require("../middleware/user_validation");
const registerController = require("../controllers/register");
const passwordController = require("../controllers/reset_password");
const multer = require("../middleware/multer_config");

router.post(
  "/signup",
  multer,
  userValidation.signupValidation(),
  registerController.signup
);
router.get("/confirm/:confirmationCode", registerController.verifyUser);
router.post(
  "/forgot-password",
  userValidation.forgotPasswordValidation(),
  passwordController.forgotPassword
);
router.post(
  "/reset-password/:token",
  userValidation.resetPasswordValidation(),
  passwordController.resetPassword
);

module.exports = router;
