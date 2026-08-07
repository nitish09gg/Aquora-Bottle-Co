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
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "Reset password link has been sent to your registered email",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your Aquora Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 10px;">
    
          <h2 style="color: #2563eb; margin-bottom: 20px;">
            Aquora Bottle Co.
          </h2>
    
          <h3 style="color: #111827;">
            Password Reset Request
          </h3>
          <p style="color:#374151; font-size:16px;">
        Hi <strong>${user.name}</strong>,
      </p>
      
          <p style="color: #4b5563;">
            We received a request to reset the password for your Aquora account.
          </p>
    
          <p style="color: #4b5563;">
            Click the button below to create a new password.
          </p>
    
          <div style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                background:#2563eb;
                color:#ffffff;
                padding:12px 24px;
                text-decoration:none;
                border-radius:6px;
                font-weight:bold;
                display:inline-block;
              "
            >
              Reset Password
            </a>
          </div>
    
          <p style="color:#6b7280;">
            This link will expire in <strong>15 minutes</strong>.
          </p>
    
          <p style="color:#6b7280;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will remain unchanged.
          </p>
    
          <hr style="margin:30px 0; border:none; border-top:1px solid #e5e7eb;">
    
          <p style="font-size:13px; color:#9ca3af;">
            Please do not reply to this email. This mailbox is not monitored.
          </p>
    
          <p style="font-size:13px; color:#9ca3af;">
            © ${new Date().getFullYear()} Aquora Bottle Co. All rights reserved.
          </p>
    
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Reset password link has been sent to your registered email",
    });
  } catch (error) {
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

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    // Set new password
    user.password = password;

    // Clear reset token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // Save user (password will be hashed by pre("save"))
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
