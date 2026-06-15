import { Router } from 'express'
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/', getExperiences)
router.post('/', protect, createExperience)
router.put('/:id', protect, updateExperience)
router.delete('/:id', protect, deleteExperience)
export default router
