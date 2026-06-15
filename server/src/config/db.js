import mongoose from 'mongoose'

/**
 * Connect to MongoDB Atlas. Resolves to true on success, false on failure.
 * We deliberately DON'T crash on failure so the API still boots for local
 * dev — DB-backed routes will return 503 until the connection is fixed.
 */
export async function connectDB(uri) {
  mongoose.set('strictQuery', true)
  // When the DB is unreachable, fail queries fast (3s) instead of the 10s
  // default buffer — keeps the API snappy and avoids hung requests.
  mongoose.set('bufferTimeoutMS', 3000)
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in server/.env')
    return false
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    console.log(`\x1b[32m✅ MongoDB connected:\x1b[0m ${mongoose.connection.host}`)
    return true
  } catch (err) {
    console.error(`\x1b[31m❌ MongoDB connection failed:\x1b[0m ${err.message}`)
    console.error('   → Verify MONGODB_URI in server/.env.')
    console.error('   → URL-encode special chars in the password (@ → %40, : → %3A, etc.).')
    console.error('   → Allow your IP in Atlas → Network Access.')
    console.error('   The API will keep running; DB routes return 503 until connected.')
    return false
  }
}

// Dev-only fallback: spin up an ephemeral in-memory MongoDB so the full app
// (admin, CRUD, contact inbox) works locally without a configured Atlas URI.
// Data resets on restart. Never used in production.
let memoryServer = null
export async function connectMemoryDB() {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    memoryServer = await MongoMemoryServer.create({ instance: { dbName: 'bellaziz_portfolio' } })
    await mongoose.connect(memoryServer.getUri())
    console.log(
      '\x1b[33m🧪 Using in-memory MongoDB (dev fallback).\x1b[0m Data resets on restart — set a valid MONGODB_URI for persistence.'
    )
    return true
  } catch (e) {
    console.error('\x1b[31m   In-memory Mongo unavailable:\x1b[0m', e.message)
    return false
  }
}

export function dbReady() {
  return mongoose.connection.readyState === 1
}
