// server/tests/setup.js
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer

// Setup in-memory MongoDB for testing
export const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  
  await mongoose.connect(mongoUri)
  console.log('Test database connected')
}

// Cleanup database after tests
export const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
  console.log('Test database disconnected')
}

// Clear all collections between tests
export const clearTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    return
  }
  
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
}