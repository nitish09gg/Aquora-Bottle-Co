const router = require("express").Router();

const {
  Signup,
  Login,
  GoogleLogin,
  Logout,
  getCurrentUser,
} = require("../controllers/AuthController");

const {
  userVerification,
} = require("../middlewares/AuthMiddleware");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/google", GoogleLogin);
router.post("/logout", Logout);
router.get("/me", userVerification, getCurrentUser);

module.exports = router;