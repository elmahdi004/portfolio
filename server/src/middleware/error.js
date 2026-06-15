import { dbReady } from '../config/db.js'

export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found — ${req.method} ${req.originalUrl}`))
}

// Central error formatter. Translates common Mongoose errors to clean status codes.
export function errorHandler(err, req, res, _next) {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  let message = err.message || 'Server error'

  if (err.name === 'CastError') {
    status = 404
    message = 'Resource not found'
  }
  if (err.code === 11000) {
    status = 409
    message = `Duplicate value: ${Object.keys(err.keyValue || {}).join(', ')}`
  }
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map((e) => e.message).join(', ')
  }
  // DB not connected → surface a helpful 503 instead of a 30s hang.
  if (!dbReady() && /buffering timed out|ECONNREFUSED|getaddrinfo/i.test(message)) {
    status = 503
    message = 'Database unavailable. Check the MongoDB connection (server/.env).'
  }

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === 'production' ? {} : { stack: err.stack }),
  })
}
