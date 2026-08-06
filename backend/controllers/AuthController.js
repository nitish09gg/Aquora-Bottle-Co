const UserModel = require("../models/UserModel");
const createSecretToken = require("../utils/SecretToken");
const validateEmail = require("../utils/ValidateEmail.js");
const isProduction = process.env.NODE_ENV === "production";
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  photo: user.photo,
  provider: user.provider,
  createdAt: user.createdAt,
});

const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const emailData = await validateEmail(email);

    if (!emailData) {
      return res.status(503).json({
        success: false,
        message: "Email validation service is temporarily unavailable.",
      });
    }

    if (!emailData.is_valid_format.value) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (
      emailData.deliverability &&
      emailData.deliverability !== "DELIVERABLE"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email doesn't exist!",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email.",
      });
    }

    const user = await UserModel.create({ name, email, password });

    const token = createSecretToken(user._id.toString());

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Account created successfully.",
        user: publicUser(user),
      });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create your account.",
    });
  }
};

const GoogleLogin = async (req, res) => {
  try {
    const { name, email, firebaseUid, photo } = req.body;

    if (!email || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google account.",
      });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        firebaseUid,
        photo,
        provider: "google",
      });
    }

    const token = createSecretToken(user._id.toString());

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Google login successful.",
        user: publicUser(user),
      });
  } catch (error) {
    console.error("Google Login:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login with Google.",
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await UserModel.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const token = createSecretToken(user._id.toString());

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Logged in successfully.",
        user: publicUser(user),
      });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to log in.",
    });
  }
};

const ForgotPassword = async (req, res) => {
  try {
    console.log("STEP 1");

    const { email } = req.body;

    console.log("STEP 2", email);

    const user = await UserModel.findOne({ email });

    console.log("STEP 3");

    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    console.log("STEP 4");

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Token saved successfully.",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Token from URL:", token);
    console.log("Hashed Token:", hashedToken);
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    // Set the new password
    user.password = password;

    // Remove reset token and expiry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save user (pre("save") middleware will hash the password)
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

const Logout = (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully.",
    });
};

const getCurrentUser = async (req, res) => {
  const user = await UserModel.findById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  return res.status(200).json({
    success: true,
    user: publicUser(user),
  });
};

module.exports = {
  Signup,
  Login,
  GoogleLogin,
  ForgotPassword,
  ResetPassword,
  Logout,
  getCurrentUser,
};
