/**
 * Order Service
 *
 * Centralizes all order-related API calls. Keeps network logic out of the UI
 * components — pages import placeOrder() instead of calling fetch directly.
 *
 * Mirrors the conventions used in authService.js (same base URL + token key).
 */

import { getToken } from "./authService";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Place a new order.
 * POST /api/orders  (protected — sends the JWT in the Authorization header)
 *
 * The backend reads the user ID from the token and recalculates the total,
 * so we only need to send the product lines.
 *
 * @param {Array<{ productId: string, quantity: number }>} products - Cart line items
 * @returns {object} The saved order returned by the backend (response.data)
 * @throws {Error} If the user is not authenticated or the request fails
 */
export const placeOrder = async (products) => {
  const token = getToken();

  // Guard — the user must be logged in to place an order
  if (!token) {
    throw new Error("You must be logged in to place an order.");
  }

  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include the JWT so the backend can identify the user
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ products }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to place order. Please try again.");
  }

  // Return only the order payload to the caller
  return data.data;
};

/**
 * Fetch the logged-in user's orders.
 * GET /api/orders  (protected)
 *
 * @returns {Array} List of the user's orders (most recent first)
 * @throws {Error} If the user is not authenticated or the request fails
 */
export const getMyOrders = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to view your orders.");
  }

  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch orders.");
  }

  return data.data;
};
