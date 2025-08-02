// server/tests/posts.test.js
import request from 'supertest'
import app from '../app.js'
import User from '../models/User.js'
import Post from '../models/Post.js'
import { setupTestDB, teardownTestDB, clearTestDB } from './setup.js'

describe('Posts Routes', () => {
  let testUser
  let authToken
  let testPost

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

    // Create test post
    testPost = await Post.create({
      content: 'This is a test post',
      author: testUser._id
    })
  })

  describe('GET /api/posts', () => {
    it('should get all posts with pagination', async () => {
      const response = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toHaveProperty('content', testPost.content)
      expect(response.body.data[0]).toHaveProperty('author')
      expect(response.body.pagination).toHaveProperty('total', 1)
      expect(response.body.pagination).toHaveProperty('current', 1)
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/posts')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })

    it('should support pagination', async () => {
      // Create more posts
      await Post.create({
        content: 'Post 2',
        author: testUser._id
      })
      await Post.create({
        content: 'Post 3',
        author: testUser._id
      })

      const response = await request(app)
        .get('/api/posts?page=1&limit=2')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.pagination).toHaveProperty('total', 3)
      expect(response.body.pagination).toHaveProperty('pages', 2)
    })
  })

  describe('GET /api/posts/:id', () => {
    it('should get post by ID', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost._id}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('content', testPost.content)
      expect(response.body.data).toHaveProperty('author')
    })

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'
      
      const response = await request(app)
        .get(`/api/posts/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Post not found')
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost._id}`)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/posts', () => {
    it('should create a new post successfully', async () => {
      const postData = {
        content: 'This is a new test post'
      }

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Post created successfully')
      expect(response.body.data).toHaveProperty('content', postData.content)
      expect(response.body.data).toHaveProperty('author', testUser._id.toString())
    })

    it('should return 400 for empty content', async () => {
      const postData = {
        content: ''
      }

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 400 for content too long', async () => {
      const postData = {
        content: 'a'.repeat(2001) // Exceeds 2000 character limit
      }

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 401 without authentication', async () => {
      const postData = {
        content: 'This is a new test post'
      }

      const response = await request(app)
        .post('/api/posts')
        .send(postData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('PUT /api/posts/:id/like', () => {
    it('should like a post successfully', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPost._id}/like`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Post liked')
      expect(response.body.data).toHaveProperty('isLiked', true)
      expect(response.body.data).toHaveProperty('likeCount', 1)
    })

    it('should unlike a post if already liked', async () => {
      // First like the post
      testPost.likes.push(testUser._id)
      await testPost.save()

      const response = await request(app)
        .put(`/api/posts/${testPost._id}/like`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Post unliked')
      expect(response.body.data).toHaveProperty('isLiked', false)
      expect(response.body.data).toHaveProperty('likeCount', 0)
    })

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'
      
      const response = await request(app)
        .put(`/api/posts/${nonExistentId}/like`)
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Post not found')
    })

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .put(`/api/posts/${testPost._id}/like`)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('POST /api/posts/:id/comments', () => {
    it('should add comment to post successfully', async () => {
      const commentData = {
        text: 'This is a test comment'
      }

      const response = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Comment added successfully')
      expect(response.body.data).toHaveProperty('text', commentData.text)
      expect(response.body.data).toHaveProperty('author')
    })

    it('should return 400 for empty comment', async () => {
      const commentData = {
        text: ''
      }

      const response = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 400 for comment too long', async () => {
      const commentData = {
        text: 'a'.repeat(501) // Exceeds 500 character limit
      }

      const response = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Validation failed')
    })

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011'
      const commentData = {
        text: 'This is a test comment'
      }
      
      const response = await request(app)
        .post(`/api/posts/${nonExistentId}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBe('Post not found')
    })

    it('should return 401 without authentication', async () => {
      const commentData = {
        text: 'This is a test comment'
      }

      const response = await request(app)
        .post(`/api/posts/${testPost._id}/comments`)
        .send(commentData)

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
    })
  })

  describe('DELETE /api/posts/:id', () => {
  it('should delete own post successfully', async () => {
    const response = await request(app)
      .delete(`/api/posts/${testPost._id}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe('Post deleted successfully')
    
    // Verify post is soft deleted (isActive = false)
    const deletedPost = await Post.findById(testPost._id)
    expect(deletedPost.isActive).toBe(false)
  })

  it('should return 403 when trying to delete another user\'s post', async () => {
    // Create another user
    const otherUser = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123'
    })

    // Create post by other user
    const otherPost = await Post.create({
      content: 'Other user\'s post',
      author: otherUser._id
    })

    const response = await request(app)
      .delete(`/api/posts/${otherPost._id}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(403)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Not authorized to delete this post')
  })

  it('should return 404 for non-existent post', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011'
    
    const response = await request(app)
      .delete(`/api/posts/${nonExistentId}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.status).toBe(404)
    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Post not found')
  })

  it('should return 401 without authentication', async () => {
    const response = await request(app)
      .delete(`/api/posts/${testPost._id}`)

    expect(response.status).toBe(401)
    expect(response.body.success).toBe(false)
  })
  })
})