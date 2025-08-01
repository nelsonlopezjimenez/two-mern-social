import express from 'express'
import { body, validationResult } from 'express-validator'
import { asyncHandler } from '../app.js'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { name, email, password } = req.body

  // Check if user already exists
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    })
  }

  // Create user
  const user = new User({
    name,
    email,
    password
  })

  await user.save()

  // Generate token
  const token = user.generateAuthToken()

  // Set cookie
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }

  res.cookie('token', token, cookieOptions)

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    },
    token
  })
}))

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required')
], asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    })
  }

  const { email, password } = req.body

  try {
    // Find user by credentials
    const user = await User.findByCredentials(email, password)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = user.generateAuthToken()

    // Set cookie
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }

    res.cookie('token', token, cookieOptions)

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        followerCount: user.followerCount,
        followingCount: user.followingCount
      },
      token
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}))

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, asyncHandler(async (req, res) => {
  // Clear cookie
  res.clearCookie('token')

  res.json({
    success: true,
    message: 'Logout successful'
  })
}))

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      bio: req.user.bio,
      followerCount: req.user.followerCount,
      followingCount: req.user.followingCount,
      createdAt: req.user.createdAt
    }
  })
}))

export default router