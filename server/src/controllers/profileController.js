import Profile from '../models/Profile.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const FIELDS = [
  'name', 'title', 'roles', 'tagline', 'bio', 'avatarUrl', 'resumeUrl',
  'location', 'email', 'phone', 'availableForWork', 'yearsExperience',
  'socials', 'stats', 'seo',
]

export async function getOrCreateProfile() {
  let profile = await Profile.findOne({ singleton: 'profile' })
  if (!profile) profile = await Profile.create({ singleton: 'profile' })
  return profile
}

// GET /api/profile
export const getProfile = asyncHandler(async (_req, res) => {
  res.json(await getOrCreateProfile())
})

// PUT /api/profile  (protected)
export const updateProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile()
  for (const f of FIELDS) if (f in req.body) profile[f] = req.body[f]
  await profile.save()
  res.json(profile)
})
