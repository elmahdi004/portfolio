import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import { connectDB, connectMemoryDB, dbReady } from './config/db.js'
import { notFound, errorHandler } from './middleware/error.js'
import { seedAll } from './utils/seed.js'

import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import experienceRoutes from './routes/experienceRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import githubRoutes from './routes/githubRoutes.js'
import assistantRoutes from './routes/assistantRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.set('trust proxy', 1) // accurate req.ip for the rate limiter

// --- Security & parsing middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'))

// --- Rate limiting (stricter on sensitive endpoints) ---
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 600, standardHeaders: true, legacyHeaders: false })
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many login attempts. Please try again later.' },
})
const contactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 20 })
const assistantLimiter = rateLimit({ windowMs: 5 * 60 * 1000, max: 40 })

app.use('/api', apiLimiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/contact', contactLimiter)
app.use('/api/assistant', assistantLimiter)

// --- Health check ---
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', db: dbReady() ? 'connected' : 'disconnected', uptime: process.uptime() })
)

// --- Routes ---
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/experiences', experienceRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/contact', messageRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/assistant', assistantRoutes)

// --- Errors ---
app.use(notFound)
app.use(errorHandler)

// Start HTTP server immediately (don't block on DB), then connect + seed.
app.listen(PORT, () => {
  console.log(`\x1b[36m🚀 API listening on\x1b[0m http://localhost:${PORT}`)
})

async function boot() {
  let ok = await connectDB(process.env.MONGODB_URI)
  if (!ok && process.env.NODE_ENV !== 'production' && process.env.USE_MEMORY_DB === 'true') {
    console.log('   ↳ Falling back to an in-memory database for local development…')
    ok = await connectMemoryDB()
  }
  if (ok) {
    try {
      await seedAll()
    } catch (e) {
      console.error('Seed error:', e.message)
    }
  }
}
boot()
