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
      eyebrow={step === "signup" ? "CREATE YOUR MOCKUP" : "VERIFY YOUR EMAIL"}
      title={
        step === "signup"
          ? "Let's make water part of your brand."
          : "One last step to get started."
      }
      description={
        step === "signup"
          ? "Create your account to begin your custom bottle journey."
          : `We've sent a 6-digit verification code to ${formData.email}.`
      }
      footer={
        <>
          {step === "signup" ? (
            <>
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-sky-600 hover:text-sky-700"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <span className="font-semibold text-slate-400">
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="font-semibold text-sky-600 transition hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResending ? "Sending..." : "Resend code"}
                </button>
              )}
            </>
          )}
        </>
      }
    >
      {/* ========================================================= */}
      {/* EMAIL SIGNUP */}
      {/* ========================================================= */}

      {signupMethod === "email" && step === "signup" && (
        <>
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Work email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@hotel.com"
                className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Create password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Create Account
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">OR</span>
              </div>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
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
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {otpError}
            </div>
          )}

          {/* OTP */}
          <div>
            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-semibold text-slate-700"
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
              className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* Verify */}
          <button
            type="submit"
            disabled={otp.length !== 6}
            className="w-full rounded-xl bg-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Verify Email
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={handleChangeEmail}
            className="w-full text-sm font-semibold text-sky-600 transition hover:text-sky-700"
          >
            ← Change email
          </button>
        </form>
      )}

      {/* ========================================================= */}
      {/* PHONE SIGNUP */}
      {/* ========================================================= */}

      {signupMethod === "phone" && (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Phone Number
            </label>

            <div className="flex overflow-hidden rounded-xl border border-sky-100 bg-sky-50/70 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-100">
              <span className="flex items-center border-r border-sky-100 px-4 font-semibold text-slate-700">
                +91
              </span>

              <input
                id="phone"
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="9876543210"
                className="w-full bg-transparent px-4 py-3 outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={sendOTP}
            className="w-full rounded-xl bg-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            Send OTP
          </button>

          <div id="recaptcha-container" />
        </div>
      )}
    </AuthLayout>
  );
}

export default Signup;
