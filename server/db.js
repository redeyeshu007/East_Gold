/**
 * MongoDB connection helper (Mongoose).
 * Connects once and reuses the connection across the process.
 */
import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

mongoose.set('strictQuery', true)

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10_000,
    })
    const { host, name } = mongoose.connection
    console.log(`✓ MongoDB connected → ${host}/${name}`)
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message)
    throw err
  }
}

export default connectDB
