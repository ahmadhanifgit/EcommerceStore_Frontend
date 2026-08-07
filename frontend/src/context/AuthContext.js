import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

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
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  /**
   * Login — calls backend API, stores token + user in localStorage
   * @param {string} email
   * @param {string} password
   * @returns {object} { token, user }
   * @throws {Error} if login fails
   */
  const login = async (email, password) => {
    const result = await authService.login(email, password);
    setUser(result.user);
    return result;
  };

  /**
   * Signup — calls backend API to register a new user
   * Does NOT auto-login — user must login separately after registration
   * @param {string} fullName
   * @param {string} email
   * @param {string} password
   * @returns {object} { success, message }
   * @throws {Error} if registration fails
   */
  const signup = async (fullName, email, password) => {
    const result = await authService.register(fullName, email, password);
    return result;
  };

  /**
   * Logout — clears token and user data from localStorage
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
