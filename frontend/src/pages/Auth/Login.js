import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import validation, { getErrorMessage } from "../../utils/validation";
import "../../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
        login(formData.email, formData.password);
        setSuccessMessage("✓ Login successful! Redirecting...");

        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    }, 800);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container login-container">
        <h1>Login</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
                placeholder="Enter your password"
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

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="auth-link-text">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">
            Sign Up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
