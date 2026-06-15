import Experience from '../models/Experience.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/experiences
export const getExperiences = asyncHandler(async (_req, res) => {
  const experiences = await Experience.find().sort({ order: 1, startDate: -1 })
  res.json(experiences)
})

// POST /api/experiences  (protected)
export const createExperience = asyncHandler(async (req, res) => {
  const exp = await Experience.create(req.body)
  res.status(201).json(exp)
})

// PUT /api/experiences/:id  (protected)
export const updateExperience = asyncHandler(async (req, res) => {
  const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!exp) { res.status(404); throw new Error('Experience not found') }
  res.json(exp)
})

// DELETE /api/experiences/:id  (protected)
export const deleteExperience = asyncHandler(async (req, res) => {
  const exp = await Experience.findByIdAndDelete(req.params.id)
  if (!exp) { res.status(404); throw new Error('Experience not found') }
  res.json({ message: 'Experience deleted', id: req.params.id })
})
