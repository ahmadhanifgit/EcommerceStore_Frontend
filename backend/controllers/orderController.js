const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Pricing rules for an order.
 *
 * Kept as named, environment-overridable constants (never hardcoded inline)
 * so the backend stays the single source of truth for the amount charged and
 * mirrors the values shown to the user on the checkout screen.
 */
const SHIPPING_FEE = Number(process.env.ORDER_SHIPPING_FEE) || 20;
const TAX_RATE = Number(process.env.ORDER_TAX_RATE) || 0.1;

// Helper — round a money value to 2 decimal places
const round2 = (value) => Math.round(value * 100) / 100;

/**
 * Create a new order
 * POST /api/orders  (protected — requires a valid JWT)
 *
 * Flow:
 * 1. Read the logged-in user's ID from req.user (set by authMiddleware).
 * 2. Validate the incoming cart items.
 * 3. Verify each product exists in the database and use the DB price/title/image
 *    as the source of truth (prevents client-side price tampering).
 * 4. Recalculate the total on the server (subtotal + shipping + tax).
 * 5. Save the order — Mongoose creates the `orders` collection automatically.
 * 6. Return a standard success response.
 */
const createOrder = async (req, res) => {
  try {
    // 1. User ID always comes from the verified JWT, never from the request body
    const userId = req.user.id;
    const { products } = req.body;

    // 2. Validate the cart is present and not empty
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Add at least one product before placing an order.'
      });
    }

    // 3. Verify every product against the database and build trusted line items
    const verifiedProducts = [];
    let subtotal = 0;

    for (const item of products) {
      const { productId, quantity } = item;

      // Each line must reference a product
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Each product must include a productId.'
        });
      }

      // Quantity must be a whole number greater than zero
      const qty = Number(quantity);
      if (!Number.isInteger(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Product quantity must be a whole number greater than zero.'
        });
      }

      // Confirm the product actually exists in the store
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${productId}`
        });
      }

      // Use DB values as the source of truth — do not trust prices from the client
      subtotal += product.price * qty;
      verifiedProducts.push({
        productId: product._id,
        title: product.name,
        price: product.price,
        quantity: qty,
        image: product.image
      });
    }

    // 4. Recalculate the authoritative total on the server
    subtotal = round2(subtotal);
    const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
    const tax = round2((subtotal + shipping) * TAX_RATE);
    const totalPrice = round2(subtotal + shipping + tax);

    // 5. Save the order (status defaults to "Pending", createdAt added by timestamps)
    const order = await Order.create({
      user: userId,
      products: verifiedProducts,
      totalPrice
    });

    // 6. Standard success response
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);

    // Invalid ObjectId passed as a productId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'One or more product IDs are invalid.'
      });
    }

    // Mongoose schema validation failure
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while placing the order. Please try again.'
    });
  }
};

/**
 * Get the logged-in user's orders
 * GET /api/orders  (protected)
 *
 * Convenience endpoint so the frontend can show an order history / confirm an
 * order after it is placed. Only ever returns the authenticated user's orders.
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Orders fetched successfully.',
      data: orders
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders. Please try again.'
    });
  }
};

module.exports = { createOrder, getMyOrders };
