// server/tests/users.test.js
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js'

describe('User Routes', () => {
  let testUser
  let authToken
  let otherUser

  beforeAll(async () => {
    await setupTestDB()
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
    
    // Create test user
    testUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
    authToken = testUser.generateAuthToken()

    // Create another user for testing
    otherUser = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123'
    })
  })

  describe('GET /api/users', () => {
    it('should get all users (excluding current user)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1) // Only otherUser, not testUser
      expect(response.body.data[0]).toHaveProperty('name', otherUser.name)
      expect(response.body.data[0]).toHaveProperty('email', otherUser.email)
      expect(response.body.data[0]).not.toHaveProperty('password')
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/users')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should support pagination', async () => {
      // Create more users
      await User.create({
        name: 'User 3',
        email: 'user3@example.com',
        password: 'password123'
      })
      await User.create({
        name: 'User 4',
        email: 'user4@example.com',
        password: 'password123'
      })

      const response = await request(app)
        .get('/api/users?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.pagination).toHaveProperty('current', '1')
      expect(response.body.pagination).toHaveProperty('total', 3)
    })
  })

  describe('GET /api/users/:id', () => {
    it('should get user by ID', async () => {
      const response = await request(app)
        .get(`/api/users/${otherUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('name', otherUser.name)
      expect(response.body.data).toHaveProperty('email', otherUser.email)
      expect(response.body.data).not.toHaveProperty('password')
    })

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'
      
      const response = await request(app)
        .get(`/api/users/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User not found')
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/users/${otherUser._id}`)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'John Updated',
        bio: 'Updated bio'
      }

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Profile updated successfully')
      expect(response.body.data).toHaveProperty('name', updateData.name)
      expect(response.body.data).toHaveProperty('bio', updateData.bio)
    })

    it('should return 400 for invalid name length', async () => {
      const updateData = {
        name: 'A' // Too short
      }

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 401 without authentication', async () => {
      const updateData = {
        name: 'John Updated'
      }

      const response = await request(app)
        .put('/api/users/profile')
        .send(updateData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/users/:id/follow', () => {
    it('should follow another user successfully', async () => {
      const response = await request(app)
        .post(`/api/users/${otherUser._id}/follow`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User followed')
      expect(response.body.data).toHaveProperty('isFollowing', true)
      expect(response.body.data).toHaveProperty('followerCount', 1)
    })

    it('should unfollow user if already following', async () => {
      // First follow the user
      testUser.following.push(otherUser._id)
      otherUser.followers.push(testUser._id)
      await testUser.save()
      await otherUser.save()

      const response = await request(app)
        .post(`/api/users/${otherUser._id}/follow`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('User unfollowed')
      expect(response.body.data).toHaveProperty('isFollowing', false)
      expect(response.body.data).toHaveProperty('followerCount', 0)
    })

    it('should return 400 when trying to follow self', async () => {
      const response = await request(app)
        .post(`/api/users/${testUser._id}/follow`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('You cannot follow yourself')
    })

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'
      
      const response = await request(app)
        .post(`/api/users/${nonExistentId}/follow`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('User not found')
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post(`/api/users/${otherUser._id}/follow`)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })
})