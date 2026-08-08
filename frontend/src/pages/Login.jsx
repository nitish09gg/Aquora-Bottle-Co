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
          {/* {isSubmitting ? "Signing in..." : "Sign in"} */}
       
            Sign In
            
        
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
    </AuthLayout>
  );
}

export default Login;
