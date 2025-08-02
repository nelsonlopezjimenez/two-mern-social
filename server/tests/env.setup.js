// server/tests/env.setup.js - Set environment variables for tests
import dotenv from 'dotenv'

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.JWT_EXPIRE = '1d'
process.env.PORT = '5001'
process.env.LOG_LEVEL = 'error'
process.env.DISABLE_RATE_LIMIT = 'true'

// Load test environment file if it exists
dotenv.config({ path: '.env.test' })

console.log('Test environment configured:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
})