// server/tests/auth.test.js
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js'

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
  })

  describe('POST /api/auth/register', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    }

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name', validUser.name)
      expect(response.body.data).toHaveProperty('email', validUser.email)
      expect(response.body).toHaveProperty('token')
      
      // Check if user was created in database
      const userInDB = await User.findOne({ email: validUser.email })
      expect(userInDB).toBeTruthy()
      expect(userInDB.name).toBe(validUser.name)
    })

    it('should return 400 if email already exists', async () => {
      // Create user first
      await User.create(validUser)

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User already exists with this email')
    })

    it('should return 400 for invalid email', async () => {
      const invalidUser = {
        ...validUser,
        email: 'invalid-email'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 400 for short password', async () => {
      const invalidUser = {
        ...validUser,
        password: '123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 400 for missing name', async () => {
      const invalidUser = {
        email: validUser.email,
        password: validUser.password
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/auth/login', () => {
    let testUser

    beforeEach(async () => {
      testUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    })

    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Login successful')
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('email', loginData.email)
      expect(response.body).toHaveProperty('token')
    })

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'wrong@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should return 400 for missing email', async () => {
      const loginData = {
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })
  })

  describe('GET /api/auth/me', () => {
    let testUser
    let authToken

    beforeEach(async () => {
      testUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      authToken = testUser.generateAuthToken()
    })

    it('should return current user data with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('id')
      expect(response.body.data).toHaveProperty('name', testUser.name)
      expect(response.body.data).toHaveProperty('email', testUser.email)
      expect(response.body.data).not.toHaveProperty('password')
    })

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Access denied. No token provided.')
    })

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Invalid token.')
    })
  })

  describe('POST /api/auth/logout', () => {
    let testUser
    let authToken

    beforeEach(async () => {
      testUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
      authToken = testUser.generateAuthToken()
    })

    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Logout successful')
    })

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})