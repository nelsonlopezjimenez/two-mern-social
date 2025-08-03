// server/tests/debug-auth-routes.test.js - Debug the actual routes
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js'

describe('Debug Auth Routes', () => {
  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
  })

  describe('Login Route Debug', () => {
    let testUser
    let testUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    beforeEach(async () => {
      // Create user via model (not via API)
      testUser = await User.create(testUserData)
      console.log('Created test user:', {
        id: testUser._id,
        email: testUser.email,
        name: testUser.name
      })
    })

    it('should debug login process step by step', async () => {
      console.log('\n=== DEBUGGING LOGIN PROCESS ===')
      
      // Step 1: Check if user exists in database
      const userInDB = await User.findOne({ email: testUserData.email }).select('+password')
      console.log('1. User in database:', {
        found: !!userInDB,
        id: userInDB?._id,
        email: userInDB?.email,
        hasPassword: !!userInDB?.password,
        isActive: userInDB?.isActive
      })

      // Step 2: Test password comparison manually
      if (userInDB) {
        const passwordMatch = await userInDB.comparePassword(testUserData.password)
        console.log('2. Manual password comparison:', passwordMatch)
      }

      // Step 3: Test findByCredentials method
      try {
        const foundUser = await User.findByCredentials(testUserData.email, testUserData.password)
        console.log('3. findByCredentials result:', {
          found: !!foundUser,
          id: foundUser?._id,
          email: foundUser?.email
        })
      } catch (error) {
        console.log('3. findByCredentials error:', error.message)
      }

      // Step 4: Test the actual login route
      console.log('4. Testing login route...')
      const loginData = {
        email: testUserData.email,
        password: testUserData.password
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      console.log('5. Login response:', {
        status: response.status,
        success: response.body.success,
        message: response.body.message,
        hasToken: !!response.body.token,
        hasData: !!response.body.data
      })

      if (response.status !== 200) {
        console.log('   Error details:', response.body)
      }

      // This test is for debugging, so we'll just log results
      console.log('=== END DEBUG ===\n')
    })

    it('should test registration first', async () => {
      console.log('\n=== TESTING REGISTRATION ===')
      
      const newUserData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUserData)

      console.log('Registration response:', {
        status: response.status,
        success: response.body.success,
        message: response.body.message,
        hasToken: !!response.body.token,
        hasData: !!response.body.data
      })

      if (response.status === 201) {
        console.log('✅ Registration working correctly')
        
        // Now try to login with the newly registered user
        console.log('\n--- Testing login with newly registered user ---')
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: newUserData.email,
            password: newUserData.password
          })

        console.log('Login after registration:', {
          status: loginResponse.status,
          success: loginResponse.body.success,
          message: loginResponse.body.message
        })
      } else {
        console.log('❌ Registration failed:', response.body)
      }
    })

    it('should check if routes exist', async () => {
      console.log('\n=== CHECKING ROUTE EXISTENCE ===')
      
      // Test if login route exists
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({})

      console.log('Login route check:', {
        status: loginResponse.status,
        notFound: loginResponse.status === 404
      })

      // Test if register route exists  
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({})

      console.log('Register route check:', {
        status: registerResponse.status,
        notFound: registerResponse.status === 404
      })

      // Test if me route exists
      const meResponse = await request(app)
        .get('/api/auth/me')

      console.log('Me route check:', {
        status: meResponse.status,
        notFound: meResponse.status === 404
      })
    })
  })
})