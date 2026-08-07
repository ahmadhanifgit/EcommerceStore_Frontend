import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * If the user is not logged in, redirects to /login.
 * If auth state is still loading, shows a loading spinner.
 *
 * Usage in App.js:
 *   <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
 */
function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();

  // While checking auth state (reading from localStorage), show loading
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated — render the protected content
  return children;
}

export default ProtectedRoute;
