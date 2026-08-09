import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../services/firebase";
import AuthLayout from "../components/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4040";

function Signup() {
  const navigate = useNavigate();
  const { setUser, setPageLoading, setLoadingConfig } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [phone, setPhone] = useState("");
  const [phoneStep, setPhoneStep] = useState("phone");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneIsSubmitting, setPhoneIsSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupMethod, setSignupMethod] = useState("email");

  const [step, setStep] = useState("signup");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      setLoadingConfig({
        title: "Creating your account...",
        message: "Sending a verification code to your email.",
      });

      setPageLoading(true);

      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      // Account is NOT created yet.
      // OTP has been sent.
      setStep("verify");
    } catch (error) {
      setError(error.message);
    } finally {
      setPageLoading(false);
      setIsSubmitting(false);
    }
  };

  const handlePhoneSignup = async () => {
    console.log("API_URL:", API_URL);
    console.log("Phone Signup URL:", `${API_URL}/api/auth/phone-signup`);
    if (phone.length !== 10) {
      setPhoneOtpError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.name.trim()) {
      setPhoneOtpError("Please enter your full name.");
      return;
    }

    try {
      setPhoneOtpError("");
      setPhoneIsSubmitting(true);

      setLoadingConfig({
        title: "Sending verification code...",
        message: "Sending an OTP to your phone.",
      });

      setPageLoading(true);

      const response = await fetch(`${API_URL}/api/auth/phone-signup`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone,
        }),
      });

      const data = await response.json();

      console.log("Phone Signup Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send verification code.");
      }

      setPhoneStep("verify");
      setPhoneOtp("");
    } catch (error) {
      console.error("Phone Signup Error:", error);
      setPhoneOtpError(error.message);
    } finally {
      setPageLoading(false);
      setPhoneIsSubmitting(false);
    }
  };

  const handleVerifyPhone = async (event) => {
    event.preventDefault();

    if (phoneOtp.length !== 6) {
      setPhoneOtpError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setPhoneOtpError("");

      setLoadingConfig({
        title: "Verifying your phone...",
        message: "Checking your verification code.",
      });

      setPageLoading(true);

      const response = await fetch(`${API_URL}/api/auth/verify-phone`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp: phoneOtp,
        }),
      });

      const data = await response.json();

      console.log("Verify Phone Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Phone verification failed.");
      }

      setUser(data.user);

      navigate("/browse", {
        replace: true,
      });
    } catch (error) {
      console.error("Verify Phone Error:", error);
      setPhoneOtpError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setOtpError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setOtpError("");

      setLoadingConfig({
        title: "Verifying your email...",
        message: "Checking your verification code.",
      });

      setPageLoading(true);

      const response = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });

      const data = await response.json();

      console.log("Verify Email Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Email verification failed.");
      }

      setUser(data.user);

      navigate("/browse", {
        replace: true,
      });
    } catch (error) {
      console.error("Verify Email Error:", error);
      setOtpError(error.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0 || isResending) {
      return;
    }

    try {
      setOtpError("");
      setIsResending(true);

      setLoadingConfig({
        title: "Sending a new code...",
        message: "Please wait while we send another verification code.",
      });

      setPageLoading(true);

      const response = await fetch(`${API_URL}/api/auth/resend-email-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      console.log("Resend OTP Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to resend verification code.");
      }

      // Start the 60-second cooldown
      setResendCooldown(60);

      // Clear the old OTP
      setOtp("");
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setOtpError(error.message);
    } finally {
      setPageLoading(false);
      setIsResending(false);
    }
  };
  const handleChangeEmail = () => {
    setStep("signup");

    setOtp("");
    setOtpError("");
    setError("");

    // Optional: allow the user to immediately edit the email
    setTimeout(() => {
      document.getElementById("email")?.focus();
    }, 0);
  };

  const sendOTP = async () => {
    try {
      if (phone.length !== 10) {
        setError("Please enter a valid 10-digit phone number.");
        return;
      }

      setError("");

      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
          }
        );

        await recaptchaVerifier.current.render();
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        recaptchaVerifier.current
      );

      setConfirmationResult(confirmation);

      alert("OTP sent successfully!");
    } catch (err) {
      console.error("Firebase OTP Error:", err);

      switch (err.code) {
        case "auth/invalid-phone-number":
          setError("Please enter a valid Indian phone number.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/invalid-app-credential":
          setError(
            "reCAPTCHA verification failed. Please refresh the page and try again."
          );
          break;

        default:
          setError(err.message || "Failed to send OTP.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoadingConfig({
        title: "Signing in with Google...",
        message: "Connecting your Google account to Aquora.",
      });

      setPageLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          firebaseUid: user.uid,
          photo: user.photoURL,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message);
      }

      setUser(data.user);

      navigate("/browse", {
        replace: true,
      });
      console.log("Navigated to browse");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);
  return (
    <AuthLayout
      mode="signup"
      eyebrow={
        signupMethod === "phone"
          ? phoneStep === "phone"
            ? "CREATE YOUR MOCKUP"
            : "VERIFY YOUR PHONE"
          : step === "signup"
          ? "CREATE YOUR MOCKUP"
          : "VERIFY YOUR EMAIL"
      }
      title={
        signupMethod === "phone" && phoneStep === "verify"
          ? "Verify your phone number."
          : step === "signup"
          ? "Let's make water part of your brand."
          : "One last step to get started."
      }
      description={
        signupMethod === "phone" && phoneStep === "verify"
          ? `We've sent a 6-digit verification code to +91 ${phone}.`
          : step === "signup"
          ? "Create your account to begin your custom bottle journey."
          : `We've sent a 6-digit verification code to ${formData.email}.`
      }
      footer={
        <>
          {signupMethod === "email" ? (
            step === "signup" ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Didn't receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="font-semibold text-slate-500">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending}
                    className="font-semibold text-[#c9a24b] transition hover:text-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isResending ? "Sending..." : "Resend code"}
                  </button>
                )}
              </>
            )
          ) : phoneStep === "phone" ? (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Didn't receive the code? {/* Phone resend will be added here */}
              <button
                type="button"
                className="font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
              >
                Resend code
              </button>
            </>
          )}
        </>
      }
    >
      {/* ========================================================= */}
      {/* EMAIL / PHONE TOGGLE */}
      {/* ========================================================= */}

      {step === "signup" && (
        <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => {
              setSignupMethod("email");
              setError("");
              setPhoneOtpError("");
            }}
            className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
              signupMethod === "email"
                ? "bg-[#c9a24b] text-[#121212] shadow-lg shadow-[#c9a24b]/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Continue with Email
          </button>

          <button
            type="button"
            onClick={() => {
              setSignupMethod("phone");
              setError("");
              setPhoneOtpError("");
            }}
            className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
              signupMethod === "phone"
                ? "bg-[#c9a24b] text-[#121212] shadow-lg shadow-[#c9a24b]/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Continue with Phone
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* EMAIL SIGNUP */}
      {/* ========================================================= */}

      {signupMethod === "email" && step === "signup" && (
        <>
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Work email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@hotel.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Create password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <rect x="4" y="11" width="16" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
                />
              </div>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a24b] py-3.5 font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/10 transition hover:-translate-y-0.5 hover:bg-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
              {!isSubmitting && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0a] px-4 text-sm text-slate-500">OR</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3.5 font-semibold text-white transition hover:border-[#c9a24b] hover:bg-white/10"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Sign up with Google
            </button>
          </form>
        </>
      )}

      {/* ========================================================= */}
      {/* EMAIL OTP VERIFICATION */}
      {/* ========================================================= */}

      {signupMethod === "email" && step === "verify" && (
        <form onSubmit={handleVerifyEmail} className="space-y-6">
          {/* Error */}
          {otpError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {otpError}
            </div>
          )}

          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
                setOtpError("");
              }}
              placeholder="Enter 6-digit code"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
            />
          </div>

          {/* Verify */}
          <button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full rounded-xl bg-[#c9a24b] py-3.5 font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/10 transition hover:-translate-y-0.5 hover:bg-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Verify Email
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={handleChangeEmail}
            className="w-full text-sm font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
          >
            ← Change email
          </button>
        </form>
      )}

      {/* ========================================================= */}
      {/* PHONE SIGNUP */}
      {/* ========================================================= */}

      {signupMethod === "phone" && phoneStep === "phone" && (
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="phone-name"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Full name
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-slate-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="phone-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Phone Number
            </label>

            <div className="flex overflow-hidden rounded-xl border border-white/10 bg-white/5 focus-within:border-[#c9a24b] focus-within:bg-white/10 focus-within:ring-4 focus-within:ring-[#c9a24b]/20">
              <span className="flex items-center border-r border-white/10 px-4 text-sm font-semibold text-slate-300">
                +91
              </span>

              <input
                id="phone"
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ""));
                  setPhoneOtpError("");
                }}
                placeholder="9876543210"
                className="w-full bg-transparent px-4 py-3.5 text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Error */}
          {phoneOtpError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {phoneOtpError}
            </div>
          )}

          {/* Send OTP */}
          <button
            type="button"
            onClick={handlePhoneSignup}
            disabled={phoneIsSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a24b] py-3.5 font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/10 transition hover:-translate-y-0.5 hover:bg-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {phoneIsSubmitting ? "Sending..." : "Send Verification Code"}
            {!phoneIsSubmitting && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
      )}

      {signupMethod === "phone" && phoneStep === "verify" && (
        <form onSubmit={handleVerifyPhone} className="space-y-6">
          {phoneOtpError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {phoneOtpError}
            </div>
          )}

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Verify your phone
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              We've sent a 6-digit verification code to
            </p>

            <p className="mt-1 font-semibold text-[#c9a24b]">+91 {phone}</p>
          </div>

          <div>
            <label
              htmlFor="phone-otp"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Verification Code
            </label>

            <input
              id="phone-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={phoneOtp}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, "").slice(0, 6);
                setPhoneOtp(value);
                setPhoneOtpError("");
              }}
              placeholder="Enter 6-digit code"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
            />
          </div>

          <button
            type="submit"
            disabled={phoneOtp.length !== 6}
            className="w-full rounded-xl bg-[#c9a24b] py-3.5 font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/10 transition hover:-translate-y-0.5 hover:bg-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Verify Phone
          </button>

          <button
            type="button"
            onClick={() => {
              setPhoneStep("phone");
              setPhoneOtp("");
              setPhoneOtpError("");
            }}
            className="w-full text-sm font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
          >
            ← Change phone number
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default Signup;
