import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, lowercase: true, index: true },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    category: { type: String, default: 'Web' },
    role: { type: String, default: '' },
    period: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    links: {
      live: { type: String, default: '' },
      github: { type: String, default: '' },
      demo: { type: String, default: '' },
    },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

projectSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

export default mongoose.model('Project', projectSchema)
