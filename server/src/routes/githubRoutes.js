import { Router } from 'express'
import { getGithubStats } from '../controllers/githubController.js'

const router = Router()
router.get('/stats', getGithubStats)
export default router
