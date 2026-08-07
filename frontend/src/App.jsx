import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Browse from "./pages/Browse";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";

function App() {

  const { pageLoading } = useAuth();

  if (pageLoading) {
    return <LoadingScreen />;
  }
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Reset Password */}
      <Route
        path="/reset-password/:token"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Browse */}
      <Route
        path="/browse"
        element={
          <ProtectedRoute>
            <Browse />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;