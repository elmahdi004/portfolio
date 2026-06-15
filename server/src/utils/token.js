import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'token'
const MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days

export function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export function setTokenCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
  })
}

export function clearTokenCookie(res) {
  res.cookie(COOKIE_NAME, '', { httpOnly: true, expires: new Date(0) })
}

export { COOKIE_NAME }
