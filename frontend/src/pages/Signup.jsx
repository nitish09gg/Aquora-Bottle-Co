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

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
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

setUser(data.user);

navigate("/browse", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <AuthLayout
      mode="signup"
      eyebrow="CREATE YOUR MOCKUP"
      title="Let's make water part of your brand."
      description="Create your account to begin your custom bottle journey."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-sky-600 transition hover:text-sky-700"
          >
            Sign in
          </Link>
        </>
      }
    >
      {/* Toggle */}
      <div className="mb-8 flex rounded-xl border border-sky-100 bg-sky-50 p-1">
        <button
          type="button"
          onClick={() => setSignupMethod("email")}
          className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
            signupMethod === "email"
              ? "bg-white text-sky-600 shadow"
              : "text-slate-500"
          }`}
        >
          Continue with Email
        </button>

        <button
          type="button"
          onClick={() => setSignupMethod("phone")}
          className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
            signupMethod === "phone"
              ? "bg-white text-sky-600 shadow"
              : "text-slate-500"
          }`}
        >
          Continue with Phone
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ================= EMAIL SIGNUP ================= */}

      {signupMethod === "email" && (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
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
      )}

      {/* ================= PHONE SIGNUP ================= */}

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
          <div id="recaptcha-container"></div>
        </div>
      )}
    </AuthLayout>
  );
}

export default Signup;
