const router = require("express").Router();

const {
  Signup,
  VerifyEmail,
  ResendEmailOTP,
  PhoneSignup,
  VerifyPhone,
  Login,
  GoogleLogin,
  ForgotPassword,
  ResetPassword,
  Logout,
  getCurrentUser,
} = require("../controllers/AuthController");
const {
  userVerification,
} = require("../middlewares/AuthMiddleware");

router.post("/signup", Signup);
router.post("/verify-email", VerifyEmail);
router.post("/resend-email-otp", ResendEmailOTP);
router.post("/phone-signup", PhoneSignup);
router.post("/verify-phone", VerifyPhone);
router.post("/login", Login);
router.post("/google", GoogleLogin);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);
router.post("/logout", Logout);
router.get("/me", userVerification, getCurrentUser);

module.exports = router;