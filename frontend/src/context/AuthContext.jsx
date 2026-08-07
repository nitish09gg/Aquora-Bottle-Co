import { createContext, useContext, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4040";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [loadingConfig, setLoadingConfig] = useState({
    title: "Welcome to Aquora",
    message: "Preparing your collection...",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        const data = await response.json();
        console.log("Auth API Response:", {
          status: response.status,
          ok: response.ok,
          data,
        });

        if (response.ok && data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        pageLoading,
        setPageLoading,
        loadingConfig,
        setLoadingConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
