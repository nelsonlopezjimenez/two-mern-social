import express from 'express'
import { body, validationResult } from 'express-validator'
import multer from 'multer'
// Remove asyncHandler import
import auth from '../middleware/auth.js'
import Post from '../models/Post.js'

const router = express.Router()

// Configure multer for image uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Private
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query

  const posts = await Post.find({ isActive: true })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })

  const total = await Post.countDocuments({ isActive: true })

  res.json({
    success: true,
    data: posts,
    pagination: {
      current: parseInt(page),
      pages: Math.ceil(total / limit),
      total
    }
  })
})

// Add other routes following the same pattern...

export default router