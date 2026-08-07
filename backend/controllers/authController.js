const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

/**
 * Register a new user
 * POST /api/auth/register
 *
 * 1. Validate required fields
 * 2. Check if email already exists
 * 3. Hash password with bcrypt
 * 4. Save user to database
 * 5. Return success response (no token — user must login separately)
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (name, email, password)'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please use a different email or login.'
      });
    }

    // Hash the password — never store plain text
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create and save the new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();

    // Return success response (no token — user should login after registering)
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please login to continue.'
    });
  } catch (error) {
    console.error('Registration error:', error);

    // Handle Mongoose duplicate key error (email unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists. Please use a different email.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

/**
 * Login an existing user
 * POST /api/auth/login
 *
 * 1. Validate required fields
 * 2. Find user by email
 * 3. Compare password with bcrypt
 * 4. Generate JWT token
 * 5. Return token + user data
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token with user ID and email
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return token and user data (never return password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.'
    });
  }
};

module.exports = { register, login };
