import Project from '../models/Project.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/projects  (public: published only; ?all=1 for admin)
export const getProjects = asyncHandler(async (req, res) => {
  const filter = req.query.all ? {} : { status: 'published' }
  const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 })
  res.json(projects)
})

// GET /api/projects/:id
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
  if (!project) { res.status(404); throw new Error('Project not found') }
  res.json(project)
})

// POST /api/projects  (protected)
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body)
  res.status(201).json(project)
})

// PUT /api/projects/:id  (protected)
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!project) { res.status(404); throw new Error('Project not found') }
  res.json(project)
})

// DELETE /api/projects/:id  (protected)
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) { res.status(404); throw new Error('Project not found') }
  res.json({ message: 'Project deleted', id: req.params.id })
})
