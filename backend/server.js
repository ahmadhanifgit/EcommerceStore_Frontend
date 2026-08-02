const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) { }

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB Atlas / Local MongoDB using Mongoose
mongoose
  .connect(MONGO_URI, { dbName: 'ecommerce' })
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully! Database: ecommerce');
  })
  .catch((err) => {
    console.warn('⚠️  MongoDB connection warning:', err.message);
    console.warn('   Note: Make sure to replace <db_password> in backend/.env with your actual database user password.');
  });

// Handle Mongoose Connection Events
mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  Mongoose disconnected from MongoDB');
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to the E-Commerce Backend API!',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const states = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
  const dbState = states[mongoose.connection.readyState] || 'Unknown';
  res.json({
    status: 'OK',
    dbState,
    databaseName: mongoose.connection.name || 'ecommerce',
    uptime: `${Math.floor(process.uptime())}s`
  });
});

// GET /api/products - Fetch all products from MongoDB
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }
    if (search) {
      query.name = { $regex: new RegExp(search, 'i') };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products', error: error.message });
  }
});

// GET /api/products/:id - Fetch single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid Product ID or Server Error', error: error.message });
  }
});

// POST /api/products - Create a new product in MongoDB
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, description, category, stock } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required fields.'
      });
    }

    const newProduct = new Product({
      name,
      price,
      image: image || '',
      description: description || '',
      category,
      stock: stock !== undefined ? stock : 0
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=================================`);
  console.log(`🌐 Express Server running at: http://localhost:${PORT}`);
  console.log(`=================================\n`);
});
