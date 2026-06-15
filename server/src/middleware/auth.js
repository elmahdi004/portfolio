import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { COOKIE_NAME } from '../utils/token.js'

// Gate routes behind a valid admin JWT (httpOnly cookie or Bearer header).
export const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.cookies?.[COOKIE_NAME]) token = req.cookies[COOKIE_NAME]
  else if (req.headers.authorization?.startsWith('Bearer '))
    token = req.headers.authorization.split(' ')[1]

  if (!token) {
    res.status(401)
    throw new Error('Not authorized — no token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      res.status(401)
      throw new Error('Not authorized — account no longer exists')
    }
    next()
  } catch (err) {
    res.status(401)
    throw new Error('Not authorized — invalid or expired token')
  }
})
