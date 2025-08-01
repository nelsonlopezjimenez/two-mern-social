import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const options = {
      // Connection options for Mongoose 8
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family:4
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options)
    
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })
    
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

export default connectDB