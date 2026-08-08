const UserModel = require("../models/UserModel");
const createSecretToken = require("../utils/SecretToken");
const validateEmail = require("../utils/ValidateEmail.js");
const isProduction = process.env.NODE_ENV === "production";
const sendEmail = require("../utils/sendEmail");
const EmailVerificationModel = require("../models/EmailVerificationModel");
const PhoneVerificationModel = require("../models/PhoneVerificationModel");
const sendSMS = require("../utils/sendSMS");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");

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

    const normalizedEmail = email.toLowerCase().trim();

    // Validate email
    const emailData = await validateEmail(normalizedEmail);

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

    // Check if account already exists
    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this email.",
      });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash password before temporary storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // OTP expires in 10 minutes
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Remove any previous pending verification
    await EmailVerificationModel.deleteMany({
      email: normalizedEmail,
    });

    // Store temporary signup information
    await EmailVerificationModel.create({
      email: normalizedEmail,
      name,
      password: hashedPassword,
      otpHash,
      otpExpires,
      attempts: 0,
      lastOtpSentAt: new Date(),
      resendCount: 0,
    });

    // Send OTP email
    await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your Aquora Account",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="color: #2563eb;">
            Aquora Bottle Co.
          </h2>

          <h3 style="color: #111827;">
            Verify your email
          </h3>

          <p style="color: #4b5563;">
            Hey, ${name}
          </p>

          <p style="color: #4b5563;">
            Thanks for creating an Aquora account.
            Please use the verification code below to continue.
          </p>

          <div style="
            margin: 30px 0;
            padding: 18px;
            background: #eff6ff;
            border-radius: 10px;
            text-align: center;
          ">
            <span style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563eb;
            ">
              ${otp}
            </span>
          </div>

          <p style="color:#6b7280;">
            This code will expire in <strong>10 minutes</strong>.
          </p>

          <p style="color:#6b7280;">
            If you didn't create an Aquora account, you can safely ignore
            this email.
          </p>

          <hr style="
            margin:30px 0;
            border:none;
            border-top:1px solid #e5e7eb;
          ">

          <p style="font-size:13px; color:#9ca3af;">
            Please do not reply to this email.
          </p>

          <p style="font-size:13px; color:#9ca3af;">
            © ${new Date().getFullYear()} Aquora Bottle Co.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code.",
    });
  }
};

const PhoneSignup = async (req, res) => {
  console.log("🔥 PHONE SIGNUP HIT");
  console.log("BODY:", req.body);
  try {
    const { name, phone } = req.body;

    if (!name || !phone ) {
      return res.status(400).json({
        success: false,
        message: "Name and phone number are required.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }


    // Normalize Indian phone number
    const normalizedPhone = `+91${phone}`;

    // Check whether account already exists
    const existingUser = await UserModel.findOne({
      phone: normalizedPhone,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with this phone number.",
      });
    }

    // Check for an existing pending verification
    let verification = await PhoneVerificationModel.findOne({
      phone: normalizedPhone,
    });

    // Prevent repeated OTP requests within 60 seconds
    if (verification?.lastOtpSentAt) {
      const secondsSinceLastOtp =
        (Date.now() - verification.lastOtpSentAt.getTime()) / 1000;

      if (secondsSinceLastOtp < 60) {
        const remainingSeconds = Math.ceil(60 - secondsSinceLastOtp);

        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another code.`,
          remainingSeconds,
        });
      }
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before storing
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Send SMS first
    await sendSMS({
      phone: normalizedPhone,
      otp,
    });

    // Create/update temporary verification
    if (verification) {
      verification.name = name;
      verification.otpHash = otpHash;
      verification.otpExpires = otpExpires;
      verification.attempts = 0;
      verification.lastOtpSentAt = new Date();
      verification.resendCount += 1;

      await verification.save();
    } else {
      verification = await PhoneVerificationModel.create({
        phone: normalizedPhone,
        name,
        otpHash,
        otpExpires,
        attempts: 0,
        lastOtpSentAt: new Date(),
        resendCount: 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your phone.",
    });
  } catch (error) {
    console.error("Phone Signup error:", error);
    console.error("Phone Signup stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code.",
    });
  }
};
const VerifyPhone = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    const normalizedPhone = `+91${phone}`;

    const verification = await PhoneVerificationModel.findOne({
      phone: normalizedPhone,
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found or expired.",
      });
    }

    // Check OTP expiry
    if (verification.otpExpires < new Date()) {
      await PhoneVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Limit incorrect attempts
    if (verification.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new verification code.",
      });
    }

    // Hash entered OTP
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    // Compare
    if (otpHash !== verification.otpHash) {
      verification.attempts += 1;
      await verification.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }

    // Double-check that phone wasn't registered
    const existingUser = await UserModel.findOne({
      phone: normalizedPhone,
    });

    if (existingUser) {
      await PhoneVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(409).json({
        success: false,
        message: "An account already exists with this phone number.",
      });
    }

    // Create actual user
    // Create actual user
    const user = new UserModel({
      name: verification.name,
      phone: normalizedPhone,
      provider: "phone",
    });
    
    await user.save();

    // Remove temporary verification data
    await PhoneVerificationModel.deleteOne({
      _id: verification._id,
    });

    // Create login token
    const token = createSecretToken(user._id.toString());

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Phone verified and account created successfully.",
        user: publicUser(user),
      });
  } catch (error) {
    console.error("Verify Phone error:", error);
    console.error("Verify Phone stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Unable to verify your phone.",
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

const PhoneLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    const normalizedPhone = `+91${phone}`;

    // Check whether account exists
    const user = await UserModel.findOne({
      phone: normalizedPhone,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account exists with this phone number.",
      });
    }

    // Find existing OTP verification record
    let verification = await PhoneVerificationModel.findOne({
      phone: normalizedPhone,
    });

    // Prevent repeated OTP requests within 60 seconds
    if (verification?.lastOtpSentAt) {
      const secondsSinceLastOtp =
        (Date.now() - verification.lastOtpSentAt.getTime()) / 1000;

      if (secondsSinceLastOtp < 60) {
        const remainingSeconds = Math.ceil(
          60 - secondsSinceLastOtp
        );

        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another code.`,
          remainingSeconds,
        });
      }
    }

    // Generate OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Hash OTP
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const otpExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Send OTP
    await sendSMS({
      phone: normalizedPhone,
      otp,
    });

    // Create/update verification
    if (verification) {
      verification.name = user.name;
      verification.otpHash = otpHash;
      verification.otpExpires = otpExpires;
      verification.attempts = 0;
      verification.lastOtpSentAt = new Date();
      verification.resendCount += 1;

      await verification.save();
    } else {
      verification = await PhoneVerificationModel.create({
        phone: normalizedPhone,
        name: user.name,
        otpHash,
        otpExpires,
        attempts: 0,
        lastOtpSentAt: new Date(),
        resendCount: 0,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your phone.",
    });
  } catch (error) {
    console.error("Phone Login error:", error);
    console.error("Phone Login stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Unable to send verification code.",
    });
  }
};

const VerifyPhoneLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    const normalizedPhone = `+91${phone}`;

    const verification =
      await PhoneVerificationModel.findOne({
        phone: normalizedPhone,
      });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "Verification request not found or expired.",
      });
    }

    // Check expiry
    if (verification.otpExpires < new Date()) {
      await PhoneVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired. Please request a new one.",
      });
    }

    // Limit attempts
    if (verification.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new verification code.",
      });
    }

    // Hash entered OTP
    const otpHash = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (otpHash !== verification.otpHash) {
      verification.attempts += 1;
      await verification.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }

    // Find user
    const user = await UserModel.findOne({
      phone: normalizedPhone,
    });

    if (!user) {
      await PhoneVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(404).json({
        success: false,
        message: "Account not found.",
      });
    }

    // Delete used OTP
    await PhoneVerificationModel.deleteOne({
      _id: verification._id,
    });

    // Create login token
    const token = createSecretToken(
      user._id.toString()
    );

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Phone login successful.",
        user: publicUser(user),
      });
  } catch (error) {
    console.error("Verify Phone Login error:", error);
    console.error(
      "Verify Phone Login stack:",
      error.stack
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify your phone.",
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

const VerifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verification = await EmailVerificationModel.findOne({
      email: normalizedEmail,
    });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Verification request not found or has expired.",
      });
    }

    // Check OTP expiry
    if (verification.otpExpires < new Date()) {
      await EmailVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Limit incorrect attempts
    if (verification.attempts >= 5) {
      await EmailVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. Please request a new OTP.",
      });
    }

    // Hash submitted OTP
    const otpHash = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    // Compare OTP
    if (otpHash !== verification.otpHash) {
      verification.attempts += 1;
      await verification.save();

      return res.status(400).json({
        success: false,
        message: "Incorrect verification code.",
      });
    }

    // Make sure the email wasn't registered while verification was pending
    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      await EmailVerificationModel.deleteOne({
        _id: verification._id,
      });

      return res.status(409).json({
        success: false,
        message: "An account already exists with this email.",
      });
    }

    // Create the actual user.
    // IMPORTANT:
    // verification.password is ALREADY hashed.
    const user = new UserModel({
      name: verification.name,
      email: verification.email,
      password: verification.password,
    });

    // Prevent the UserModel pre-save hook from hashing the password again
    user.$locals.passwordAlreadyHashed = true;

    await user.save();

    // Remove temporary verification data
    await EmailVerificationModel.deleteOne({
      _id: verification._id,
    });

    // Create authentication token
    const token = createSecretToken(user._id.toString());

    return res
      .status(201)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        message: "Email verified and account created successfully.",
        user: publicUser(user),
      });
  } catch (error) {
    console.error("Verify Email error:", error);
    console.error("Verify Email stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to verify your email.",
    });
  }
};

const ResendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const verification = await EmailVerificationModel.findOne({
      email: normalizedEmail,
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        message: "No pending email verification found.",
      });
    }

    // 60-second cooldown
    if (verification.lastOtpSentAt) {
      const secondsSinceLastOtp =
        (Date.now() - verification.lastOtpSentAt.getTime()) / 1000;

      if (secondsSinceLastOtp < 60) {
        const remainingSeconds = Math.ceil(60 - secondsSinceLastOtp);

        return res.status(429).json({
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another code.`,
          remainingSeconds,
        });
      }
    }

    // Generate a new 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP before storing
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Send the new OTP
    await sendEmail({
      to: verification.email,
      subject: "Your Aquora Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2 style="color: #2563eb;">
            Aquora Bottle Co.
          </h2>

          <h3 style="color: #111827;">
            Your New Verification Code
          </h3>

          <p style="color: #4b5563;">
            Hey, ${verification.name}
          </p>

          <p style="color: #4b5563;">
            You requested a new verification code for your Aquora account.
          </p>

          <div style="
            margin: 30px 0;
            padding: 20px;
            background: #eff6ff;
            border-radius: 12px;
            text-align: center;
          ">
            <span style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #2563eb;
            ">
              ${otp}
            </span>
          </div>

          <p style="color: #6b7280;">
            This code will expire in <strong>15 minutes</strong>.
          </p>

          <p style="color: #6b7280;">
            If you didn't request this code, you can safely ignore this email.
          </p>

          <hr style="
            margin: 30px 0;
            border: none;
            border-top: 1px solid #e5e7eb;
          ">

          <p style="font-size: 13px; color: #9ca3af;">
            © ${new Date().getFullYear()} Aquora Bottle Co. All rights reserved.
          </p>

        </div>
      `,
    });

    // Update OTP only after email was successfully sent
    verification.otpHash = otpHash;
    verification.otpExpires = otpExpires;
    verification.attempts = 0;
    verification.lastOtpSentAt = new Date();
    verification.resendCount += 1;

    await verification.save();

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend Email OTP error:", error);
    console.error("Resend Email OTP stack:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Unable to resend verification code.",
    });
  }
};

module.exports = {
  Signup,
  Login,
  GoogleLogin,
  ForgotPassword,
  ResetPassword,
  Logout,
  getCurrentUser,
  VerifyEmail,
  ResendEmailOTP,
  PhoneSignup,
  VerifyPhone,
  PhoneLogin,
  VerifyPhoneLogin,
};
