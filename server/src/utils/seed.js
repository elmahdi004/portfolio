import 'dotenv/config'
import { pathToFileURL } from 'url'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Profile from '../models/Profile.js'
import Project from '../models/Project.js'
import Experience from '../models/Experience.js'
import Skill from '../models/Skill.js'

// ---------------------------------------------------------------------------
// Starter content — realistic but fully editable from the admin dashboard.
// ---------------------------------------------------------------------------

const PROFILE = {
  singleton: 'profile',
  name: 'El Mahdi Bellaziz',
  title: 'DevSecOps Engineer & Full-Stack Developer',
  roles: [
    'DevSecOps Engineer',
    'Full-Stack Developer',
    'Cloud & Security Enthusiast',
    'Automation Builder',
  ],
  tagline: 'I build secure, scalable systems — and break them before attackers can.',
  bio: `I'm a DevSecOps engineer and full-stack developer who lives at the intersection of shipping fast and staying secure. I design CI/CD pipelines with security baked in, harden cloud-native infrastructure, and build polished MERN applications end to end.

From threat-modeling a deployment to crafting a delightful React UI, I care about the whole lifecycle — secure by design, automated by default, and observable in production.`,
  avatarUrl: '',
  resumeUrl: '',
  location: '🌍 Remote · Open to relocation',
  email: 'elmahdibellaziz@gmail.com',
  phone: '',
  availableForWork: true,
  yearsExperience: 3,
  socials: {
    github: 'https://github.com/elmahdi004',
    linkedin: 'https://www.linkedin.com/in/elmahdibellaziz',
    twitter: '',
    website: '',
    email: 'elmahdibellaziz@gmail.com',
  },
  stats: [
    { label: 'Projects Shipped', value: '20+' },
    { label: 'Years Experience', value: '3+' },
    { label: 'Technologies', value: '30+' },
    { label: 'Pipelines Hardened', value: '15+' },
  ],
  seo: {
    metaTitle: 'El Mahdi Bellaziz — DevSecOps Engineer',
    metaDescription: 'DevSecOps Engineer & Full-Stack Developer building secure, scalable systems.',
  },
}

const SKILLS = [
  // Languages
  { name: 'JavaScript', category: 'Languages', level: 92, color: '#f7df1e', featured: true },
  { name: 'TypeScript', category: 'Languages', level: 88, color: '#3178c6', featured: true },
  { name: 'Python', category: 'Languages', level: 85, color: '#3776ab', featured: true },
  { name: 'Bash', category: 'Languages', level: 80, color: '#4eaa25' },
  { name: 'Go', category: 'Languages', level: 65, color: '#00add8' },
  // Frontend
  { name: 'React', category: 'Frontend', level: 92, color: '#61dafb', featured: true },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, color: '#38bdf8', featured: true },
  { name: 'Next.js', category: 'Frontend', level: 82, color: '#ffffff' },
  { name: 'Framer Motion', category: 'Frontend', level: 80, color: '#ff4d8d' },
  // Backend
  { name: 'Node.js', category: 'Backend', level: 90, color: '#5fa04e', featured: true },
  { name: 'Express', category: 'Backend', level: 88, color: '#cccccc' },
  { name: 'MongoDB', category: 'Backend', level: 85, color: '#47a248', featured: true },
  { name: 'PostgreSQL', category: 'Backend', level: 78, color: '#4169e1' },
  { name: 'REST & WebSockets', category: 'Backend', level: 86, color: '#8b5cf6' },
  // DevOps
  { name: 'Docker', category: 'DevOps', level: 90, color: '#2496ed', featured: true },
  { name: 'Kubernetes', category: 'DevOps', level: 78, color: '#326ce5', featured: true },
  { name: 'GitHub Actions', category: 'DevOps', level: 88, color: '#2088ff' },
  { name: 'GitLab CI', category: 'DevOps', level: 85, color: '#fc6d26' },
  { name: 'Terraform', category: 'DevOps', level: 75, color: '#7b42bc' },
  { name: 'Nginx', category: 'DevOps', level: 80, color: '#009639' },
  // Security
  { name: 'OWASP / AppSec', category: 'Security', level: 86, color: '#e11d48', featured: true },
  { name: 'SAST / DAST', category: 'Security', level: 82, color: '#f43f5e' },
  { name: 'Trivy & Snyk', category: 'Security', level: 84, color: '#1904da' },
  { name: 'Burp Suite', category: 'Security', level: 78, color: '#ff6633' },
  { name: 'JWT / OAuth2', category: 'Security', level: 88, color: '#d63aff' },
  // Cloud
  { name: 'AWS', category: 'Cloud', level: 80, color: '#ff9900', featured: true },
  { name: 'Linux', category: 'Cloud', level: 88, color: '#fcc624' },
]

const now = new Date()
const yearsAgo = (y) => new Date(now.getFullYear() - y, now.getMonth(), 1)

const EXPERIENCES = [
  {
    role: 'DevSecOps Engineer',
    company: 'Confidential / Freelance',
    location: 'Remote',
    type: 'work',
    startDate: yearsAgo(2),
    endDate: null,
    current: true,
    description:
      'Embed security across the SDLC: design hardened CI/CD pipelines, automate vulnerability scanning, and ship cloud-native MERN apps.',
    highlights: [
      'Hardened GitLab CI/CD pipelines with SAST, DAST, secret-scanning and image scanning gates',
      'Containerized and orchestrated services with Docker & Kubernetes',
      'Cut critical vulnerabilities by integrating Trivy & Snyk into the build',
    ],
    tags: ['DevSecOps', 'CI/CD', 'Docker', 'Kubernetes', 'Security'],
    order: 0,
  },
  {
    role: 'Full-Stack Developer (MERN)',
    company: 'Independent Projects',
    location: 'Remote',
    type: 'work',
    startDate: yearsAgo(3),
    endDate: yearsAgo(2),
    current: false,
    description:
      'Built and shipped full-stack web applications with React, Node.js, Express and MongoDB, with a focus on clean architecture and DX.',
    highlights: [
      'Designed REST APIs and responsive React front-ends',
      'Implemented JWT/OAuth2 authentication and role-based access control',
      'Deployed to cloud with automated GitHub Actions workflows',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
    order: 1,
  },
  {
    role: 'Telecommunications & Computer Engineering',
    company: 'Engineering School',
    location: '',
    type: 'education',
    startDate: yearsAgo(5),
    endDate: yearsAgo(1),
    current: false,
    description:
      'Engineering degree covering networks, telecommunications, systems and software — the foundation for a security-first engineering mindset.',
    highlights: ['Networks & protocols', 'Systems programming', 'Software engineering'],
    tags: ['Networking', 'Telecom', 'Systems'],
    order: 2,
  },
  {
    role: 'Cisco Certified DevNet Associate',
    company: 'Cisco',
    location: '',
    type: 'certification',
    startDate: yearsAgo(1),
    endDate: yearsAgo(1),
    current: false,
    description: 'Network automation, APIs, and infrastructure-as-code on Cisco platforms.',
    highlights: ['REST APIs', 'Automation', 'Infrastructure as Code'],
    tags: ['Cisco', 'DevNet', 'Automation'],
    order: 3,
  },
]

const PROJECTS = [
  {
    title: 'Secure CI/CD Pipeline Hardening',
    summary:
      'End-to-end hardening of a GitLab CI/CD pipeline for a MERN e-commerce app — from vulnerable baseline to a measured, attack-resistant build.',
    description:
      'A graded DevSecOps project: take a deliberately vulnerable MERN application, demonstrate real attacks, then harden the pipeline step by step (secret scanning, SAST/DAST, dependency & container scanning, least-privilege runners) and measure the improvement.',
    coverImage: '',
    tags: ['GitLab CI', 'Docker', 'Trivy', 'SAST', 'DAST', 'MERN'],
    category: 'Security',
    role: 'DevSecOps Engineer',
    period: '2025',
    highlights: [
      'Vulnerable → attacks → hardened → measured methodology',
      'Container image scanning + supply-chain integrity checks',
      'Secret detection and least-privilege CI runners',
    ],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: true,
    status: 'published',
    order: 0,
  },
  {
    title: 'Aurora Portfolio (this site)',
    summary:
      'A MERN portfolio with an aurora-glass UI, a full admin CMS, a ⌘K command palette, live GitHub stats and an AI "ask me" assistant.',
    description:
      'Built with React + Vite + Tailwind + Framer Motion on the front, Express + MongoDB on the back. Includes JWT-secured admin, a Claude-powered chat assistant, dark/light theming and a fully responsive aurora design system.',
    coverImage: '',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'Framer Motion', 'AI'],
    category: 'Web',
    role: 'Full-Stack Developer',
    period: '2026',
    highlights: [
      'Glassmorphism + animated aurora design system',
      'Admin dashboard with full CRUD',
      'AI assistant grounded in real profile data',
    ],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: true,
    status: 'published',
    order: 1,
  },
  {
    title: 'Container Vulnerability Dashboard',
    summary:
      'A dashboard that aggregates Trivy/Grype scan results across container images and surfaces risk trends over time.',
    description:
      'Collects scanner output in CI, stores findings, and visualizes severity distribution, drift and remediation progress for a fleet of images.',
    coverImage: '',
    tags: ['Trivy', 'Docker', 'React', 'Node.js'],
    category: 'DevOps',
    role: 'Engineer',
    period: '2025',
    highlights: ['CVE trend analysis', 'Severity heatmaps', 'CI integration'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: true,
    status: 'published',
    order: 2,
  },
  {
    title: 'Zero-Trust Auth Microservice',
    summary: 'A reusable authentication microservice with JWT, refresh-token rotation, RBAC and rate limiting.',
    description:
      'Stateless auth service exposing register/login/refresh endpoints with httpOnly cookies, brute-force protection and audit logging — drop-in for MERN stacks.',
    coverImage: '',
    tags: ['Node.js', 'JWT', 'OAuth2', 'Security'],
    category: 'Security',
    role: 'Developer',
    period: '2024',
    highlights: ['Refresh-token rotation', 'Role-based access control', 'Brute-force protection'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: false,
    status: 'published',
    order: 3,
  },
  {
    title: 'Infra-as-Code Starter Kit',
    summary: 'Terraform + Docker Compose templates to spin up a hardened, observable web stack in minutes.',
    description:
      'Opinionated IaC modules with sane security defaults, reverse proxy, TLS, and a monitoring baseline — a fast path from zero to a production-shaped environment.',
    coverImage: '',
    tags: ['Terraform', 'Docker', 'Nginx', 'IaC'],
    category: 'DevOps',
    role: 'Engineer',
    period: '2024',
    highlights: ['Reusable modules', 'Secure defaults', 'Built-in observability'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: false,
    status: 'published',
    order: 4,
  },
  {
    title: 'Realtime Network Monitor',
    summary: 'A WebSocket dashboard visualizing live network/telemetry data with alerting.',
    description:
      'Streams device metrics over WebSockets into a React dashboard with thresholds and alerts — bridging a telecom background with modern web tooling.',
    coverImage: '',
    tags: ['WebSockets', 'React', 'Node.js', 'Telecom'],
    category: 'Web',
    role: 'Developer',
    period: '2023',
    highlights: ['Live streaming charts', 'Threshold alerts', 'Responsive UI'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: false,
    status: 'published',
    order: 5,
  },
]

export async function seedAdmin() {
  const count = await User.countDocuments()
  if (count > 0) return { created: false }
  const email = (process.env.ADMIN_EMAIL || 'admin@bellaziz.dev').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe!2026'
  const name = process.env.ADMIN_NAME || 'El Mahdi Bellaziz'
  await User.create({ name, email, password, role: 'admin' })
  console.log(`\x1b[32m👤 Admin created:\x1b[0m ${email}  (password from ADMIN_PASSWORD)`)
  return { created: true, email }
}

export async function seedContent() {
  const results = {}

  if ((await Profile.countDocuments()) === 0) {
    await Profile.create(PROFILE)
    results.profile = true
  }
  if ((await Skill.countDocuments()) === 0) {
    await Skill.insertMany(SKILLS.map((s, i) => ({ ...s, order: i })))
    results.skills = SKILLS.length
  }
  if ((await Experience.countDocuments()) === 0) {
    await Experience.insertMany(EXPERIENCES)
    results.experiences = EXPERIENCES.length
  }
  if ((await Project.countDocuments()) === 0) {
    // create() runs the slug pre-save hook per document
    for (const p of PROJECTS) await Project.create(p)
    results.projects = PROJECTS.length
  }

  if (Object.keys(results).length) {
    console.log('\x1b[32m🌱 Seeded content:\x1b[0m', JSON.stringify(results))
  }
  return results
}

export async function seedAll() {
  await seedAdmin()
  await seedContent()
}

// Allow running directly:  npm run seed
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const ok = await connectDB(process.env.MONGODB_URI)
  if (!ok) {
    console.error('Cannot seed — database not connected.')
    process.exit(1)
  }
  await seedAll()
  await mongoose.disconnect()
  console.log('✅ Seed complete.')
  process.exit(0)
}
