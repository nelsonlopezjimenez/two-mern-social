// server/tests/auth-detailed.test.js - Copy of auth test with detailed logging
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js'

describe('Authentication Routes - Detailed Debug', () => {
  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
    // Add small delay to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  describe('POST /api/auth/login - Detailed Debug', () => {
    let testUser

    beforeEach(async () => {
      testUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      
      console.log('Test user created:', {
        id: testUser._id,
        email: testUser.email,
        name: testUser.name
      })
      
      // Add delay after user creation
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    it('should login user with valid credentials - DETAILED', async () => {
      console.log('\n=== LOGIN TEST WITH DETAILED LOGGING ===')
      
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      }

      console.log('1. Sending login request with:', loginData)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      console.log('2. Received response:')
      console.log('   Status:', response.status)
      console.log('   Body:', JSON.stringify(response.body, null, 2))
      console.log('   Headers:', response.headers)

      // Check what we got vs what we expect
      console.log('3. Checking expectations:')
      console.log('   Expected status: 200, Got:', response.status)
      console.log('   Expected success: true, Got:', response.body.success)
      console.log('   Expected message: "Login successful", Got:', response.body.message)
      console.log('   Has token:', !!response.body.token)
      console.log('   Has data:', !!response.body.data)

      if (response.body.data) {
        console.log('   Data contents:', {
          id: response.body.data.id,
          email: response.body.data.email,
          name: response.body.data.name
        })
      }

      // Now run the actual assertions and see which one fails
      try {
        expect(response.status).toBe(200)
        console.log('   ✅ Status check passed')
      } catch (e) {
        console.log('   ❌ Status check failed:', e.message)
        throw e
      }

      try {
        expect(response.body.success).toBe(true)
        console.log('   ✅ Success check passed')
      } catch (e) {
        console.log('   ❌ Success check failed:', e.message)
        throw e
      }

      try {
        expect(response.body.message).toBe('Login successful')
        console.log('   ✅ Message check passed')
      } catch (e) {
        console.log('   ❌ Message check failed:', e.message)
        console.log('   Expected: "Login successful"')
        console.log('   Actual: "' + response.body.message + '"')
        throw e
      }

      try {
        expect(response.body.data).toHaveProperty('id')
        console.log('   ✅ Data.id check passed')
      } catch (e) {
        console.log('   ❌ Data.id check failed:', e.message)
        throw e
      }

      try {
        expect(response.body.data).toHaveProperty('email', loginData.email)
        console.log('   ✅ Data.email check passed')
      } catch (e) {
        console.log('   ❌ Data.email check failed:', e.message)
        throw e
      }

      try {
        expect(response.body).toHaveProperty('token')
        console.log('   ✅ Token check passed')
      } catch (e) {
        console.log('   ❌ Token check failed:', e.message)
        throw e
      }

      console.log('=== ALL CHECKS PASSED ===\n')
    })

    it('should handle invalid password - DETAILED', async () => {
      console.log('\n=== INVALID PASSWORD TEST ===')
      
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      }

      console.log('1. Sending request with wrong password:', loginData)

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      console.log('2. Response:', {
        status: response.status,
        body: response.body
      })

      console.log('3. Expected: status 401, Got:', response.status)
      
      // Check exact assertion
      try {
        expect(response.status).toBe(401)
        console.log('   ✅ Status 401 check passed')
      } catch (e) {
        console.log('   ❌ Status check failed:', e.message)
        throw e
      }

      try {
        expect(response.body.success).toBe(false)
        console.log('   ✅ Success false check passed')
      } catch (e) {
        console.log('   ❌ Success check failed:', e.message)
        throw e
      }

      console.log('=== INVALID PASSWORD TEST COMPLETE ===\n')
    })
  })
})