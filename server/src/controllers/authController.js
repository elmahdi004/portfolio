import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { signToken, setTokenCookie, clearTokenCookie } from '../utils/token.js'

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role })

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid credentials')
  }
  const token = signToken(user)
  setTokenCookie(res, token)
  res.json({ user: publicUser(user), token })
})

// POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res)
  res.json({ message: 'Logged out' })
})

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) })
})

// PUT /api/auth/password  (protected)
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!newPassword || newPassword.length < 8) {
    res.status(400)
    throw new Error('New password must be at least 8 characters')
  }
  const user = await User.findById(req.user._id).select('+password')
  if (!(await user.matchPassword(currentPassword || ''))) {
    res.status(401)
    throw new Error('Current password is incorrect')
  }
  user.password = newPassword
  await user.save()
  res.json({ message: 'Password updated successfully' })
})
