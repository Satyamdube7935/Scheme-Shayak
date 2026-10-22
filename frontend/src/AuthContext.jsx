import { createContext, useContext, useEffect, useState } from "react";
import { api, getToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("ss_token"))
      .finally(() => setLoading(false));
  }, []);

  function saveSession({ token, user: next }) {
    localStorage.setItem("ss_token", token);
    setUser(next);
  }

  function logout() {
    localStorage.removeItem("ss_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
