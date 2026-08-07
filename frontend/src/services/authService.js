/**
 * Authentication Service
 *
 * Centralizes all auth-related API calls and localStorage operations.
 * Components should use AuthContext (which calls this service) instead of calling these directly.
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Register a new user
 * POST /api/auth/register
 *
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {object} { success, message }
 */
export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

/**
 * Login an existing user
 * POST /api/auth/login
 *
 * On success: stores token and user data in localStorage
 *
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {object} { token, user: { id, name, email } }
 */
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Store token and user data in localStorage
  const { token, user } = data.data;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { token, user };
};

/**
 * Logout the current user
 * Removes token and user data from localStorage
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get the current user from localStorage
 * @returns {object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

/**
 * Get the JWT token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if the user is authenticated
 * @returns {boolean} true if a token exists in localStorage
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};
