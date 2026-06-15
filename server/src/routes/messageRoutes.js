import { Router } from 'express'
import {
  createMessage,
  getMessages,
  markRead,
  deleteMessage,
} from '../controllers/messageController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.post('/', createMessage) // public contact form
router.get('/', protect, getMessages)
router.patch('/:id', protect, markRead)
router.delete('/:id', protect, deleteMessage)
export default router
