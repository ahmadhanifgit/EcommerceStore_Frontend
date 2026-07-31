/**
 * Form Validation Utility
 * Provides validation functions for email, password, and form fields
 */

// Email validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation functions
const validation = {
  // Validate email format
  isValidEmail: (email) => {
    return EMAIL_REGEX.test(email);
  },

  // Validate password length
  isValidPassword: (password) => {
    return password.length >= 8;
  },

  // Check if field is empty
  isFieldEmpty: (value) => {
    return !value || value.trim() === "";
  },

  // Check if passwords match
  doPasswordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  // Validate phone number (basic: 11 digits)
  isValidPhone: (phone) => {
    const phoneRegex = /^\d{11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  },

  // Validate ZIP code (5 digits)
  isValidZIP: (zip) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip.replace(/\D/g, ""));
  },
};

// Error message generator
export const getErrorMessage = (fieldName, validationType) => {
  const messages = {
    email: {
      empty: "Email is required",
      invalid: "Please enter a valid email address (e.g., example@email.com)",
    },
    password: {
      empty: "Password is required",
      invalid: "Password must be at least 8 characters long",
    },
    confirmPassword: {
      empty: "Confirm Password is required",
      invalid: "Passwords do not match",
    },
    fullName: {
      empty: "Full Name is required",
    },
    phone: {
      empty: "Phone number is required",
      invalid: "Please enter a valid 11-digit phone number",
    },
    address: {
      empty: "Address is required",
    },
    city: {
      empty: "City is required",
    },
    zip: {
      empty: "ZIP code is required",
      invalid: "Please enter a valid 5-digit ZIP code",
    },
  };

  return messages[fieldName]?.[validationType] || "Invalid input";
};

export default validation;
