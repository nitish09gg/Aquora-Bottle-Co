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
  return (
    <AuthLayout
      mode="login"
      eyebrow="WELCOME BACK"
      title="Your next great service starts here."
      description="Sign in to manage your custom bottle requests and deliveries."
      footer={
        <>
          New to Aquora?{" "}
          <Link
            to="/signup"
            className="font-semibold text-sky-600 transition hover:text-sky-700"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

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
            className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-sky-600 transition hover:text-sky-700"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sign In
        </button>

        {/* Phone Login */}
        <div className="mt-4">
          {phoneStep === "phone" ? (
            <>
              <div className="mb-2">
                <label
                  htmlFor="login-phone"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Phone number
                </label>
              </div>

              <div className="flex gap-2">
                <div className="flex items-center rounded-xl border border-sky-100 bg-sky-50/70 px-3 text-sm font-semibold text-slate-600">
                  +91
                </div>

                <input
                  id="login-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);

                    setPhone(value);
                    setPhoneOtpError("");
                  }}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className="min-w-0 flex-1 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3.5 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>

              {phoneOtpError && (
                <p className="mt-2 text-sm text-red-500">{phoneOtpError}</p>
              )}

              <button
                type="button"
                onClick={handlePhoneLogin}
                disabled={phoneIsSubmitting}
                className="mt-3 w-full rounded-xl border border-sky-200 bg-white py-3.5 font-semibold text-sky-600 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {phoneIsSubmitting ? "Sending code..." : "Continue with phone"}
              </button>
            </>
          ) : (
            <>
              <div className="mb-2">
                <label
                  htmlFor="login-phone-otp"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Verification code
                </label>
              </div>

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
                className="w-full rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3.5 text-center text-xl tracking-[0.35em] outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                We sent a verification code to +91 {phone}
              </p>

              {phoneOtpError && (
                <p className="mt-2 text-sm text-red-500">{phoneOtpError}</p>
              )}

              <button
                type="button"
                onClick={handleVerifyPhoneLogin}
                disabled={phoneIsSubmitting}
                className="mt-3 w-full rounded-xl bg-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="mt-3 w-full text-sm font-semibold text-sky-600 transition hover:text-sky-700"
              >
                Change phone number
              </button>
            </>
          )}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-slate-500">OR</span>
          </div>
        </div>

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
    </AuthLayout>
  );
}

export default Login;
