import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const { user, loading } = useAuth();

  console.log("ProtectedRoute:", { user, loading });

  if (loading) {
    return <LoadingScreen />;
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