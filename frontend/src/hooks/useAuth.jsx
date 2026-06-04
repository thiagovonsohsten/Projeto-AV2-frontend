import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AUTH_KEY = "techservLoggedIn";
const EMAIL_KEY = "techservUserEmail";
const NAME_KEY = "techservUserName";

function readSession() {
  return {
    isLoggedIn: sessionStorage.getItem(AUTH_KEY) === "1",
    email: sessionStorage.getItem(EMAIL_KEY) || "",
    name: sessionStorage.getItem(NAME_KEY) || "",
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback((email, displayName) => {
    const nome = displayName?.trim() ? displayName.trim() : email.split("@")[0];
    sessionStorage.setItem(AUTH_KEY, "1");
    sessionStorage.setItem(EMAIL_KEY, email);
    sessionStorage.setItem(NAME_KEY, nome);
    setSession({ isLoggedIn: true, email, name: nome });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    sessionStorage.removeItem(NAME_KEY);
    setSession({ isLoggedIn: false, email: "", name: "" });
  }, []);

  const value = useMemo(
    () => ({
      ...session,
      login,
      logout,
    }),
    [session, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
