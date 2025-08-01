import express from 'express'
import { body, validationResult } from 'express-validator'
import multer from 'multer'
import { asyncHandler } from '../app.js'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// Configure multer for avatar uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get('/', auth, asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query

  const query = { isActive: true, _id: { $ne: req.user._id } }
  
  if (search) {
    query.$text = { $search: search }
  }

  const users = await User.find(query)
    .select('name email avatar bio followerCount followingCount')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })

  const total = await User.countDocuments(query)

  res.json({
    success: true,
    data: users,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  })
}))

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('name email avatar bio followerCount followingCount createdAt')
    .populate('followers', 'name avatar')
    .populate('following', 'name avatar')

  if (!user || !user.isActive) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  res.json({
    success: true,
    data: user
  })
}))

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
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

  const { name, bio } = req.body
  const updateFields = {}

  if (name) updateFields.name = name
  if (bio !== undefined) updateFields.bio = bio

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password')

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  })
}))

// @route   POST /api/users/:id/follow
// @desc    Follow/Unfollow user
// @access  Private
router.post('/:id/follow', auth, asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id)
  
  if (!userToFollow || !userToFollow.isActive) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    })
  }

  if (userToFollow._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'You cannot follow yourself'
    })
  }

  const currentUser = await User.findById(req.user._id)
  
  const isFollowing = currentUser.following.includes(userToFollow._id)
  
  if (isFollowing) {
    // Unfollow
    currentUser.following.pull(userToFollow._id)
    userToFollow.followers.pull(currentUser._id)
  } else {
    // Follow
    currentUser.following.push(userToFollow._id)
    userToFollow.followers.push(currentUser._id)
  }

  await currentUser.save()
  await userToFollow.save()

  res.json({
    success: true,
    message: isFollowing ? 'User unfollowed' : 'User followed',
    data: {
      isFollowing: !isFollowing,
      followerCount: userToFollow.followerCount
    }
  })
}))

export default router