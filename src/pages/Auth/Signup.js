import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import validation, { getErrorMessage } from "../../utils/validation";
import "../../styles/Auth.css";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name);
  };

  // Validate single field
  const validateField = (fieldName) => {
    let error = "";

    if (fieldName === "fullName") {
      if (validation.isFieldEmpty(formData.fullName)) {
        error = getErrorMessage("fullName", "empty");
      }
    }

    if (fieldName === "email") {
      if (validation.isFieldEmpty(formData.email)) {
        error = getErrorMessage("email", "empty");
      } else if (!validation.isValidEmail(formData.email)) {
        error = getErrorMessage("email", "invalid");
      }
    }

    if (fieldName === "password") {
      if (validation.isFieldEmpty(formData.password)) {
        error = getErrorMessage("password", "empty");
      } else if (!validation.isValidPassword(formData.password)) {
        error = getErrorMessage("password", "invalid");
      }
    }

    if (fieldName === "confirmPassword") {
      if (validation.isFieldEmpty(formData.confirmPassword)) {
        error = getErrorMessage("confirmPassword", "empty");
      } else if (
        !validation.doPasswordsMatch(
          formData.password,
          formData.confirmPassword
        )
      ) {
        error = getErrorMessage("confirmPassword", "invalid");
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === "";
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (validation.isFieldEmpty(formData.fullName)) {
      newErrors.fullName = getErrorMessage("fullName", "empty");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.email)) {
      newErrors.email = getErrorMessage("email", "empty");
      isValid = false;
    } else if (!validation.isValidEmail(formData.email)) {
      newErrors.email = getErrorMessage("email", "invalid");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.password)) {
      newErrors.password = getErrorMessage("password", "empty");
      isValid = false;
    } else if (!validation.isValidPassword(formData.password)) {
      newErrors.password = getErrorMessage("password", "invalid");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.confirmPassword)) {
      newErrors.confirmPassword = getErrorMessage("confirmPassword", "empty");
      isValid = false;
    } else if (
      !validation.doPasswordsMatch(
        formData.password,
        formData.confirmPassword
      )
    ) {
      newErrors.confirmPassword = getErrorMessage("confirmPassword", "invalid");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      try {
        signup(formData.fullName, formData.email, formData.password);
        setSuccessMessage("✓ Account created successfully! Redirecting...");

        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Signup failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container signup-container">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join us to start shopping</p>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${
                touched.fullName && errors.fullName ? "input-error" : ""
              }`}
              placeholder="Enter your full name"
            />
            {touched.fullName && errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${
                touched.email && errors.email ? "input-error" : ""
              }`}
              placeholder="Enter your email"
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.password && errors.password ? "input-error" : ""
                }`}
                placeholder="Enter your password (min 8 characters)"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={togglePasswordVisibility}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "input-error"
                    : ""
                }`}
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={toggleConfirmPasswordVisibility}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="auth-link-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
