// server/tests/env.setup.js
// Set test environment variables before any imports
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only'
process.env.JWT_EXPIRE = '1d'
process.env.PORT = '5001'
process.env.LOG_LEVEL = 'error'
process.env.DISABLE_RATE_LIMIT = 'true'

console.log('Test environment variables set:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
})