import mongoose from 'mongoose'

const statSchema = new mongoose.Schema(
  { label: String, value: String },
  { _id: false }
)

// Singleton document describing the portfolio owner.
const profileSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'profile', unique: true },
    name: { type: String, default: 'El Mahdi Bellaziz' },
    title: { type: String, default: 'DevSecOps Engineer & Full-Stack Developer' },
    // Rotating headline phrases for the hero typing effect.
    roles: {
      type: [String],
      default: ['DevSecOps Engineer', 'Full-Stack Developer', 'Security Enthusiast'],
    },
    tagline: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    availableForWork: { type: Boolean, default: true },
    yearsExperience: { type: Number, default: 0 },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      website: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    stats: { type: [statSchema], default: [] },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
    },
  },
  { timestamps: true }
)

export default mongoose.model('Profile', profileSchema)
