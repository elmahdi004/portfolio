import Message from '../models/Message.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// POST /api/contact  (public)
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) {
    res.status(400)
    throw new Error('Name, email and message are required')
  }
  if (!EMAIL_RE.test(email)) {
    res.status(400)
    throw new Error('Please provide a valid email address')
  }
  const doc = await Message.create({
    name,
    email,
    subject,
    message,
    meta: { ip: req.ip, userAgent: req.headers['user-agent'] },
  })
  res.status(201).json({ message: "Thanks! Your message has been sent.", id: doc._id })
})

// GET /api/contact  (protected)
export const getMessages = asyncHandler(async (_req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 })
  res.json(messages)
})

// PATCH /api/contact/:id  (protected) — toggle read
export const markRead = asyncHandler(async (req, res) => {
  const m = await Message.findByIdAndUpdate(
    req.params.id,
    { read: req.body.read ?? true },
    { new: true }
  )
  if (!m) { res.status(404); throw new Error('Message not found') }
  res.json(m)
})

// DELETE /api/contact/:id  (protected)
export const deleteMessage = asyncHandler(async (req, res) => {
  const m = await Message.findByIdAndDelete(req.params.id)
  if (!m) { res.status(404); throw new Error('Message not found') }
  res.json({ message: 'Message deleted', id: req.params.id })
})
