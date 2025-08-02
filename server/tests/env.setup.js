// server/tests/env.setup.js - Environment setup for ES modules
// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.JWT_EXPIRE = '1d'
process.env.PORT = '5001'
process.env.LOG_LEVEL = 'error'
process.env.DISABLE_RATE_LIMIT = 'true'

// Optional: Load .env.test file if it exists
try {
  const { config } = await import('dotenv')
  config({ path: '.env.test' })
} catch (error) {
  // dotenv not available or .env.test doesn't exist
  console.log('Using hardcoded test environment variables')
}