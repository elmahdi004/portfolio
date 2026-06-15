import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    companyUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    type: {
      type: String,
      enum: ['work', 'education', 'certification'],
      default: 'work',
    },
    startDate: { type: Date },
    endDate: { type: Date }, // null/undefined = present
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    logo: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Experience', experienceSchema)
