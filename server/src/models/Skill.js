import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'Other' }, // Languages, DevOps, Security, Cloud, Frontend, Backend...
    level: { type: Number, default: 80, min: 0, max: 100 },
    icon: { type: String, default: '' }, // devicon class, emoji, or image URL
    color: { type: String, default: '' }, // accent color (hex)
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Skill', skillSchema)
