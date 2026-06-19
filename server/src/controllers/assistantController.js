import Anthropic from '@anthropic-ai/sdk'
import Profile from '../models/Profile.js'
import Project from '../models/Project.js'
import Experience from '../models/Experience.js'
import Skill from '../models/Skill.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { dbReady } from '../config/db.js'

const MAX_HISTORY = 12

function fmtDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.toLocaleString('en', { month: 'short' })} ${dt.getFullYear()}`
}

// Real CV-based context used when the database isn't connected, so the
// assistant still answers with grounded facts about El Mahdi.
const STATIC_CONTEXT = {
  profile: {
    name: 'El Mahdi Bellaziz',
    title: 'Cybersecurity & Full-Stack Engineer',
    location: 'Safi, Morocco',
    email: 'elmahdibellaziz@gmail.com',
    availableForWork: true,
    bio: "El Mahdi is a cybersecurity engineering student and vulnerability-research engineer in Safi, Morocco. On contract he generates OSS-fuzz-style vulnerable code repositories plus correct, validated patches to train and evaluate frontier AI code-repair models (C, C++, Python, Assembly), and builds full-stack web & mobile apps with Laravel, Vue/Nuxt, React and Flutter. CCNA 1–3 certified, pursuing a State Engineer degree in Intelligent Networks & Cybersecurity.",
  },
  skills: [
    'JavaScript', 'Python', 'C', 'C++', 'PHP', 'Java', 'Laravel', 'Vue.js', 'Nuxt.js',
    'React', 'Flutter', 'Node.js', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'GitLab CI',
    'Wireshark', 'Cisco',
  ].map((name) => ({ name, category: 'Skill' })),
  projects: [
    { title: 'CI/CD & Supply-Chain Security Hardening', summary: 'Hardened a GitLab CI/CD pipeline & Docker images for a MERN app, measuring attack-surface reduction.' },
    { title: 'Collaborative Blood Donation Platform', summary: 'Web admin + Flutter donor app with MapBox localization.' },
    { title: "Children's School-Route Tracking App", summary: 'Real-time school-route tracking for parents (web + mobile).' },
    { title: 'Legakte — Online Admin Procedures Platform', summary: 'Secure auth, Veriff identity check, Stripe/BCE/BNP payments.' },
  ],
  experiences: [
    { role: 'Vulnerability Research Engineer (Contract)', company: 'AI Model Training Data', current: true },
    { role: 'Full-Stack Developer (Freelance)', company: 'Legakte' },
  ],
}

// Pull the owner's data so the assistant answers from real, grounded facts.
async function buildContext() {
  if (!dbReady()) return STATIC_CONTEXT
  const [profile, projects, experiences, skills] = await Promise.all([
    Profile.findOne({ singleton: 'profile' }).lean(),
    Project.find({ status: 'published' }).sort({ featured: -1, order: 1 }).lean(),
    Experience.find().sort({ order: 1, startDate: -1 }).lean(),
    Skill.find().sort({ order: 1 }).lean(),
  ])
  return { profile, projects, experiences, skills }
}

function contextToSystem(ctx) {
  const { profile, projects, experiences, skills } = ctx
  const name = profile?.name || 'El Mahdi Bellaziz'
  const lines = []
  lines.push(`You are "${name}'s portfolio assistant" — a friendly, concise AI guide embedded on ${name}'s personal portfolio website.`)
  lines.push(
    `Answer visitors' questions about ${name} using ONLY the information below. If something isn't covered, say you don't have that detail and suggest the contact form. Keep answers short (2–4 sentences), warm, and professional. Never invent facts, employers, or dates. Politely decline anything unrelated to ${name}, his work, or hiring him.`
  )
  if (profile) {
    lines.push(
      `\n## About\nName: ${name}\nTitle: ${profile.title || ''}\nLocation: ${profile.location || 'N/A'}\nOpen to work: ${profile.availableForWork ? 'Yes' : 'No'}\nBio: ${profile.bio || ''}`
    )
    if (profile.email) lines.push(`Contact email: ${profile.email}`)
  }
  if (skills?.length) {
    const byCat = {}
    for (const s of skills) (byCat[s.category] ||= []).push(s.name)
    lines.push('\n## Skills')
    for (const [cat, names] of Object.entries(byCat)) lines.push(`${cat}: ${names.join(', ')}`)
  }
  if (experiences?.length) {
    lines.push('\n## Experience')
    for (const e of experiences.slice(0, 8)) {
      lines.push(
        `- ${e.role} @ ${e.company} (${fmtDate(e.startDate)} – ${e.current ? 'Present' : fmtDate(e.endDate)})${e.description ? ': ' + e.description : ''}`
      )
    }
  }
  if (projects?.length) {
    lines.push('\n## Projects')
    for (const p of projects.slice(0, 10)) {
      lines.push(
        `- ${p.title}${p.summary ? ': ' + p.summary : ''}${p.tags?.length ? ' [' + p.tags.join(', ') + ']' : ''}`
      )
    }
  }
  return lines.join('\n')
}

// Keyword fallback so the widget still answers when no API key is configured.
function fallbackAnswer(message, ctx) {
  const q = (message || '').toLowerCase()
  const name = ctx?.profile?.name || 'El Mahdi'
  if (/contact|email|reach|hire|available|opportunit/.test(q)) {
    const email = ctx?.profile?.email
    return `You can reach ${name}${email ? ` at ${email}` : ''} via the contact form on this site.${ctx?.profile?.availableForWork ? " He's currently open to new opportunities!" : ''}`
  }
  if (/skill|tech|stack|tool|language|framework/.test(q) && ctx?.skills?.length) {
    return `${name} works with ${ctx.skills.slice(0, 10).map((s) => s.name).join(', ')}, and more. See the Skills section for the full set.`
  }
  if (/project|build|made|portfolio/.test(q) && ctx?.projects?.length) {
    return `${name} has built projects like ${ctx.projects.slice(0, 3).map((p) => p.title).join(', ')}. Scroll to the Projects section to explore them.`
  }
  if (/experience|job|career|company|role/.test(q) && ctx?.experiences?.length) {
    const e = ctx.experiences[0]
    return `Most recently, ${name} worked as ${e.role} at ${e.company}. Check the Experience timeline for the full journey.`
  }
  if (/who|about|tell me|yourself|bio/.test(q)) {
    return ctx?.profile?.bio || `${name} is a DevSecOps engineer and full-stack developer who builds secure, scalable systems.`
  }
  return `I can tell you about ${name}'s skills, projects, experience, or how to get in touch — what would you like to know?`
}

// POST /api/assistant
export const askAssistant = asyncHandler(async (req, res) => {
  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400)
    throw new Error('A non-empty messages array is required')
  }

  const history = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  // Anthropic requires the first message to be a user turn — drop any leading
  // assistant messages (e.g. a UI greeting bubble).
  while (history.length && history[0].role === 'assistant') history.shift()

  if (!history.length || history[history.length - 1].role !== 'user') {
    res.status(400)
    throw new Error('The last message must be from the user')
  }

  const ctx = await buildContext()
  const lastUser = history[history.length - 1].content

  // No API key → graceful keyword fallback (widget always works).
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json({ reply: fallbackAnswer(lastUser, ctx), source: 'fallback' })
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const system = ctx
      ? contextToSystem(ctx)
      : 'You are a friendly, concise portfolio assistant for El Mahdi Bellaziz, a DevSecOps engineer & full-stack developer.'
    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5',
      max_tokens: 1024,
      system,
      messages: history,
    })
    const reply = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
    res.json({ reply: reply || "Sorry, I didn't catch that — could you rephrase?", source: 'claude' })
  } catch (err) {
    // Degrade to fallback instead of 500 so the chat stays usable.
    console.error('Assistant error:', err.message)
    res.json({ reply: fallbackAnswer(lastUser, ctx), source: 'fallback', note: 'AI temporarily unavailable' })
  }
})
