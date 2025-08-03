// server/tests/debug-user.test.js - Run this to debug User model issues
import User from '../models/User.js'
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js'

describe('Debug User Model', () => {
  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
  })

  describe('User Model Methods', () => {
    let testUser

    beforeEach(async () => {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('should create user and hash password', async () => {
      console.log('Created user:', {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        hashedPassword: testUser.password ? 'Present' : 'Missing'
      })

      expect(testUser).toBeDefined()
      expect(testUser.password).toBeDefined()
      expect(testUser.password).not.toBe('password123') // Should be hashed
      console.log('✅ Password hashing: WORKING')
    })

    it('should have comparePassword method', async () => {
      expect(typeof testUser.comparePassword).toBe('function')
      console.log('✅ comparePassword method: EXISTS')

      try {
        const isMatch = await testUser.comparePassword('password123')
        console.log('Password comparison result:', isMatch)
        expect(isMatch).toBe(true)
        console.log('✅ Password comparison: WORKING')
      } catch (error) {
        console.error('❌ Password comparison error:', error.message)
        throw error
      }
    })

    it('should have generateAuthToken method', () => {
      expect(typeof testUser.generateAuthToken).toBe('function')
      console.log('✅ generateAuthToken method: EXISTS')

      try {
        const token = testUser.generateAuthToken()
        expect(token).toBeDefined()
        expect(typeof token).toBe('string')
        console.log('Token generated:', token.substring(0, 20) + '...')
        console.log('✅ Token generation: WORKING')
      } catch (error) {
        console.error('❌ Token generation error:', error.message)
        throw error
      }
    })

    it('should have findByCredentials static method', async () => {
      expect(typeof User.findByCredentials).toBe('function')
      console.log('✅ findByCredentials static method: EXISTS')

      try {
        const foundUser = await User.findByCredentials('test@example.com', 'password123')
        expect(foundUser).toBeDefined()
        expect(foundUser._id.toString()).toBe(testUser._id.toString())
        console.log('✅ findByCredentials: WORKING')
      } catch (error) {
        console.error('❌ findByCredentials error:', error.message)
        
        // Try manual verification
        console.log('Attempting manual verification...')
        const userWithPassword = await User.findOne({ email: 'test@example.com' }).select('+password')
        if (userWithPassword) {
          console.log('User found in database:', {
            id: userWithPassword._id,
            email: userWithPassword.email,
            hasPassword: !!userWithPassword.password
          })
          
          if (userWithPassword.comparePassword) {
            const manualMatch = await userWithPassword.comparePassword('password123')
            console.log('Manual password comparison:', manualMatch)
          }
        } else {
          console.log('❌ User not found in database')
        }
        
        throw error
      }
    })

    it('should check JWT_SECRET availability', () => {
      console.log('Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Missing',
        JWT_EXPIRE: process.env.JWT_EXPIRE
      })

      expect(process.env.JWT_SECRET).toBeDefined()
      expect(process.env.JWT_SECRET).toBe('test-jwt-secret-key-for-testing-only')
      console.log('✅ JWT_SECRET: AVAILABLE')
    })
  })
})