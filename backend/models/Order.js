const mongoose = require('mongoose');

/**
 * Order Item Sub-Schema
 *
 * Represents a single purchased product line inside an order.
 * We snapshot the essential product details (title, price, image) at the
 * time of purchase so the order stays accurate even if the product is later
 * edited or deleted. Only the minimum required fields are stored — no
 * unnecessary duplication of the full product document.
 */
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required']
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    image: {
      type: String,
      default: ''
    }
  },
  { _id: false } // Sub-documents don't need their own _id
);

/**
 * Order Schema
 *
 * Stores a customer's order. The `orders` collection is created automatically
 * by Mongoose the first time an order is saved — no manual collection setup.
 */
const orderSchema = new mongoose.Schema(
  {
    // The user who placed the order — always taken from the JWT, never the client body
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    // All purchased products
    products: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'An order must contain at least one product'
      }
    },
    // Final order total — verified/recalculated on the server before saving
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    // Order lifecycle status
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'Pending'
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
