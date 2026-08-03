import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4040";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        setIsAuthenticated(response.ok && data.success);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FCFF]">
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-lg shadow-sky-100">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
          <p className="font-semibold text-slate-700">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;