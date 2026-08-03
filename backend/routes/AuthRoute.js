const router = require("express").Router();

const {
  Signup,
  Login,
  Logout,
  getCurrentUser,
} = require("../controllers/AuthController");

const {
  userVerification,
} = require("../middlewares/AuthMiddleware");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/me", userVerification, getCurrentUser);

module.exports = router;