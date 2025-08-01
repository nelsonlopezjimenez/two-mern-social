import express from 'express'
import { body, validationResult } from 'express-validator'
import multer from 'multer'
import { asyncHandler } from '../app.js'
import auth from '../middleware/auth.js'
import Post from '../models/Post.js'
import User from '../models/User.js'

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
router.get('/', auth, asyncHandler(async (req, res) => {
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
}))

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, isActive: true })

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    })
  }

  res.json({
    success: true,
    data: post
  })
}))

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', auth, upload.single('image'), [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Post content must be between 1 and 2000 characters')
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

  const { content } = req.body
  let imageUrl = ''

  // Handle image upload (you can integrate with Cloudinary here)
  if (req.file) {
    // For now, we'll store a placeholder URL
    // In production, upload to Cloudinary and get the URL
    imageUrl = '/uploads/placeholder.jpg'
  }

  const post = new Post({
    content,
    image: imageUrl,
    author: req.user._id
  })

  await post.save()

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post
  })
}))

// @route   PUT /api/posts/:id/like
// @desc    Like/unlike post
// @access  Private
router.put('/:id/like', auth, asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, isActive: true })

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    })
  }

  const likeIndex = post.likes.findIndex(
    like => like.toString() === req.user._id.toString()
  )

  let isLiked
  if (likeIndex > -1) {
    // Unlike post
    post.likes.splice(likeIndex, 1)
    isLiked = false
  } else {
    // Like post
    post.likes.push(req.user._id)
    isLiked = true
  }

  await post.save()

  res.json({
    success: true,
    message: isLiked ? 'Post liked' : 'Post unliked',
    data: {
      isLiked,
      likeCount: post.likeCount
    }
  })
}))

// @route   POST /api/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post('/:id/comments', auth, [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
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

  const post = await Post.findOne({ _id: req.params.id, isActive: true })

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    })
  }

  const newComment = {
    text: req.body.text,
    author: req.user._id
  }

  post.comments.push(newComment)
  await post.save()

  // Populate the new comment's author
  await post.populate('comments.author', 'name avatar')

  const addedComment = post.comments[post.comments.length - 1]

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: addedComment
  })
}))

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, isActive: true })

  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    })
  }

  // Check if user owns the post
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this post'
    })
  }

  // Soft delete
  post.isActive = false
  await post.save()

  res.json({
    success: true,
    message: 'Post deleted successfully'
  })
}))

export default router