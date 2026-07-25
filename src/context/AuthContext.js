import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "authUser";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulate login - in real app, this would call an API
    const userData = {
      email,
      name: email.split("@")[0],
      loginTime: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    return userData;
  };

  const signup = (fullName, email, password) => {
    // Simulate signup - in real app, this would call an API
    const userData = {
      email,
      name: fullName,
      signupTime: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
