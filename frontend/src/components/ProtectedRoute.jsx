import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const { user, loading } = useAuth();

console.log("ProtectedRoute:", { user, loading });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FCFF]">
        <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-lg shadow-sky-100">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-sky-100 border-t-sky-600" />
          <p className="font-semibold text-slate-700">
            Checking your session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
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