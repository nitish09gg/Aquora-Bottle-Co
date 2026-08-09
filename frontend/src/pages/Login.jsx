import { useRef, useState } from "react";
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

function Login() {
  const navigate = useNavigate();
  const { setUser, setPageLoading, setLoadingConfig } = useAuth();

  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneStep, setPhoneStep] = useState("phone");
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [phoneIsSubmitting, setPhoneIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        title: "Signing you in...",
        message: "Verifying your account securely.",
      });

      setPageLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      setUser(data.user);

      navigate("/browse", {
        replace: true,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setPageLoading(false);
      setIsSubmitting(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (phone.length !== 10) {
      setPhoneOtpError("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setPhoneOtpError("");
      setPhoneIsSubmitting(true);

      const response = await fetch(`${API_URL}/api/auth/phone-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
        }),
      });

      const data = await response.json();

      console.log("Phone Login Response:", {
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
      console.error("Phone Login Error:", error);
      setPhoneOtpError(error.message);
    } finally {
      setPhoneIsSubmitting(false);
    }
  };

  const handleVerifyPhoneLogin = async () => {
    if (phoneOtp.length !== 6) {
      setPhoneOtpError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setPhoneOtpError("");
      setPhoneIsSubmitting(true);

      const response = await fetch(`${API_URL}/api/auth/verify-phone-login`, {
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

      console.log("Verify Phone Login Response:", {
        status: response.status,
        ok: response.ok,
        data,
      });

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to verify phone.");
      }

      // Login successful
      window.location.href = "/";
    } catch (error) {
      console.error("Verify Phone Login Error:", error);

      setPhoneOtpError(error.message);
    } finally {
      setPhoneIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoadingConfig({
        title: "Signing you in...",
        message: "Verifying your account securely.",
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
        throw new Error(data.message || "Google login failed.");
      }

      setUser(data.user);

      navigate("/browse", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleMicrosoftSignIn = () => {
    setError("Microsoft sign-in is not configured yet. Please use email, phone or Google.");
  };

  return (
    <AuthLayout
      mode="login"
      eyebrow="Sign in to your Aquora account"
      title="Welcome Back"
      description="Access your projects, orders, mockups and manage your custom bottle branding."
      footer={
        <>
          New to Aquora?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
            Email address
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
              placeholder="youremail@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
            />
          </div>
        </div>

        {/* Phone / OTP */}
        <div>
          <label htmlFor="login-phone" className="mb-2 block text-sm font-medium text-slate-300">
            Phone number <span className="font-normal text-slate-500">(Optional)</span>
          </label>

          {phoneStep === "phone" ? (
            <>
              <div className="flex gap-2">
                <div className="flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-slate-300">
                  🇮🇳 +91
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-slate-500">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>

                <input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(value);
                    setPhoneOtpError("");
                  }}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
                />
              </div>

              {phoneOtpError && <p className="mt-2 text-sm text-red-400">{phoneOtpError}</p>}

              {phone.length === 10 && (
                <button
                  type="button"
                  onClick={handlePhoneLogin}
                  disabled={phoneIsSubmitting}
                  className="mt-2 text-sm font-semibold text-[#c9a24b] transition hover:text-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {phoneIsSubmitting ? "Sending code..." : "Continue with phone →"}
                </button>
              )}
            </>
          ) : (
            <>
              <input
                id="login-phone-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={phoneOtp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setPhoneOtp(value);
                  setPhoneOtpError("");
                }}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-center text-xl tracking-[0.35em] text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
              />

              <p className="mt-2 text-sm text-slate-400">
                We sent a verification code to +91 {phone}
              </p>

              {phoneOtpError && <p className="mt-2 text-sm text-red-400">{phoneOtpError}</p>}

              <button
                type="button"
                onClick={handleVerifyPhoneLogin}
                disabled={phoneIsSubmitting}
                className="mt-3 w-full rounded-xl bg-[#c9a24b] py-3.5 font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/10 transition hover:-translate-y-0.5 hover:bg-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phoneIsSubmitting ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPhoneStep("phone");
                  setPhoneOtp("");
                  setPhoneOtpError("");
                }}
                className="mt-3 w-full text-sm font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
              >
                Change phone number
              </button>
            </>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
            Password
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
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a24b] focus:bg-white/10 focus:ring-4 focus:ring-[#c9a24b]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3 8 10 8a9.74 9.74 0 0 0 5.39-1.61" />
                  <path d="M2 2l20 20" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Remember / forgot */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#c9a24b]"
            />
            Remember me
          </label>

          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-[#c9a24b] transition hover:text-[#e5c06a]"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c9a24b] py-3.5 font-semibold text-[#121212] shadow-lg shadow-[#c9a24b]/10 transition hover:-translate-y-0.5 hover:bg-[#e5c06a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>

        {/* Phone login (kept functional, restyled) */}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>

          <div className="relative flex justify-center">
            <span className="bg-[#0d0c0a] px-4 text-sm text-slate-500">or continue with</span>
          </div>
        </div>

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
          Continue with Google
        </button>

        <button
          type="button"
          onClick={handleMicrosoftSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white/5 py-3.5 font-semibold text-white transition hover:border-[#c9a24b] hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <rect x="2" y="2" width="9.5" height="9.5" fill="#f25022" />
            <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7fba00" />
            <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00a4ef" />
            <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#ffb900" />
          </svg>
          Continue with Microsoft
        </button>

        <p className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-[#c9a24b]">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Your data is secure with enterprise-grade encryption
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;