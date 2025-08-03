import express from 'express'
import { body, validationResult } from 'express-validator'
import multer from 'multer'
// Remove asyncHandler import
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
// @access  Private NOT NOT NOT
router.get('/', async (req, res) => {
// router.get('/', auth, async (req, res) => {
  console.log("====== line32 ====", req.query)
  const { page = 1, limit = 10, search } = req.query; 

  const query = { isActive: true }
  
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
})

// Add other routes following the same pattern...

router.get('/v2', async (req, res) => {
 let limit = 10;
  const users = await User.find()
    .select('name email avatar bio followerCount followingCount')
   
    .sort({ createdAt: -1 })


  res.json({
    success: true,
    data: users,
  })
})

export default router