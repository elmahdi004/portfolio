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
// Real starter content from El Mahdi's CVs — fully editable from the admin.
// ---------------------------------------------------------------------------

const PROFILE = {
  singleton: 'profile',
  name: 'El Mahdi Bellaziz',
  title: 'Cybersecurity & Full-Stack Engineer',
  roles: [
    'Vulnerability Research Engineer',
    'Full-Stack Developer',
    'Cybersecurity Engineering Student',
    'CCNA 1–3 Certified',
  ],
  tagline: 'I find and fix vulnerabilities — and build secure, full-stack web & mobile apps end to end.',
  bio: `I'm a cybersecurity engineering student and vulnerability-research engineer based in Safi, Morocco. On contract, I generate code repositories seeded with OSS-fuzz-style vulnerabilities and author the correct, validated patches used to train and evaluate frontier AI code-repair models — root-cause analysis, program repair, and differential / fuzz-based test oracles in C, C++, Python and Assembly.

Alongside security research, I build full-stack web and mobile applications end to end with Laravel, Vue / Nuxt, React and Flutter — from secure authentication and payment flows to real-time tracking systems. CCNA 1–3 certified and currently pursuing a State Engineer degree in Intelligent Networks & Cybersecurity.`,
  location: 'Safi, Morocco',
  email: 'elmahdibellaziz@gmail.com',
  phone: '0619664459',
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
    { label: 'Years Building', value: '3+' },
    { label: 'Projects Delivered', value: '8+' },
    { label: 'CCNA Certifications', value: '3' },
    { label: 'Spoken Languages', value: '3' },
  ],
  seo: {
    metaTitle: 'El Mahdi Bellaziz — Cybersecurity & Full-Stack Engineer',
    metaDescription:
      'Vulnerability-research engineer and full-stack developer. Finding & fixing vulnerabilities and building secure web & mobile apps.',
  },
}

const SKILLS = [
  { name: 'JavaScript', category: 'Languages', icon: 'javascript', color: '#f7df1e' },
  { name: 'Python', category: 'Languages', icon: 'python', color: '#3776ab' },
  { name: 'C', category: 'Languages', icon: 'c', color: '#a8b9cc' },
  { name: 'C++', category: 'Languages', icon: 'cplusplus', color: '#00599c' },
  { name: 'PHP', category: 'Languages', icon: 'php', color: '#777bb4' },
  { name: 'Java', category: 'Languages', icon: 'openjdk', color: '#f89820' },
  { name: 'Vue.js', category: 'Frontend & Mobile', icon: 'vuedotjs', color: '#42b883' },
  { name: 'Nuxt.js', category: 'Frontend & Mobile', icon: 'nuxtdotjs', color: '#00dc82' },
  { name: 'React', category: 'Frontend & Mobile', icon: 'react', color: '#61dafb' },
  { name: 'Tailwind CSS', category: 'Frontend & Mobile', icon: 'tailwindcss', color: '#38bdf8' },
  { name: 'Bootstrap', category: 'Frontend & Mobile', icon: 'bootstrap', color: '#7952b3' },
  { name: 'Flutter', category: 'Frontend & Mobile', icon: 'flutter', color: '#02569b' },
  { name: 'Laravel', category: 'Backend', icon: 'laravel', color: '#ff2d20' },
  { name: 'Node.js', category: 'Backend', icon: 'nodedotjs', color: '#5fa04e' },
  { name: 'Express', category: 'Backend', icon: 'express', color: '#9ca3af' },
  { name: 'Spring Boot', category: 'Backend', icon: 'springboot', color: '#6db33f' },
  { name: 'MySQL', category: 'Databases', icon: 'mysql', color: '#4479a1' },
  { name: 'PostgreSQL', category: 'Databases', icon: 'postgresql', color: '#4169e1' },
  { name: 'MongoDB', category: 'Databases', icon: 'mongodb', color: '#47a248' },
  { name: 'Docker', category: 'DevOps & Cloud', icon: 'docker', color: '#2496ed' },
  { name: 'GitLab CI', category: 'DevOps & Cloud', icon: 'gitlab', color: '#fc6d26' },
  { name: 'GitHub Actions', category: 'DevOps & Cloud', icon: 'githubactions', color: '#2088ff' },
  { name: 'Git', category: 'DevOps & Cloud', icon: 'git', color: '#f05032' },
  { name: 'Linux', category: 'DevOps & Cloud', icon: 'linux', color: '#fcc624' },
  { name: 'Wireshark', category: 'Security & Tools', icon: 'wireshark', color: '#1679a7' },
  { name: 'Cisco', category: 'Security & Tools', icon: 'cisco', color: '#1ba0d7' },
  { name: 'Postman', category: 'Security & Tools', icon: 'postman', color: '#ff6c37' },
  { name: 'pytest', category: 'Security & Tools', icon: 'pytest', color: '#0a9edc' },
  { name: 'Figma', category: 'Security & Tools', icon: 'figma', color: '#f24e1e' },
]

const EXPERIENCES = [
  {
    role: 'Vulnerability Research Engineer (Contract)',
    company: 'AI Model Training Data',
    location: 'Remote',
    type: 'work',
    current: true,
    period: '2025 — Present',
    description:
      'Generate code repositories containing deliberately injected, OSS-fuzz-style vulnerabilities together with correct, ground-truth patches — used to train and evaluate frontier AI code-repair models.',
    highlights: [
      'Author adversarial test suites and differential / fuzz-based oracles that separate correct patches from plausible-but-wrong fixes',
      'Validate against reference implementations over tens of thousands of cases; confirm every injected bug is independently detectable and necessary (leave-one-out)',
      'Work across C, C++, Python and low-level targets — memory-dump recovery, VM crackmes, binary / telemetry decoders',
    ],
    tags: ['C', 'C++', 'Python', 'Assembly', 'Vulnerability Research', 'Program Repair'],
    order: 0,
  },
  {
    role: 'State Engineer — Intelligent Networks & Cybersecurity',
    company: 'ENSA Khouribga',
    location: 'Khouribga, Morocco',
    type: 'education',
    period: '2025 — 2027 (expected)',
    description:
      'National School of Applied Sciences. Focus on cybersecurity, information security, intelligent & smart networks, cloud and IoT.',
    highlights: ['Cybersecurity & information security', 'Intelligent & smart networks', 'Cloud and IoT'],
    tags: ['Cybersecurity', 'Networks', 'Cloud', 'IoT'],
    order: 1,
  },
  {
    role: 'Full-Stack Developer (Freelance)',
    company: 'Legakte',
    location: 'Remote',
    type: 'work',
    period: 'Feb 2025 — Jul 2025',
    description:
      'Built a platform to manage administrative procedures online, with secure authentication, identity verification and bank / payment-API integrations.',
    highlights: [
      'Implemented secure auth, multi-step forms, a personalized dashboard and online credit purchases',
      'Integrated Stripe, BCE & BNP bank APIs plus Veriff identity verification',
      'Hardened payment and credit-purchase flows against common web vulnerabilities',
    ],
    tags: ['Laravel', 'Vue.js', 'Stripe', 'Veriff', 'Security'],
    order: 2,
  },
  {
    role: 'Bachelor — Information Systems & Network Engineering',
    company: 'Higher School of Technology (EST), Safi',
    type: 'education',
    period: '2024 — 2025',
    description:
      'Key modules: Cybersecurity, Advanced Network Security, Advanced Programming (J2EE), Advanced Databases, Business Intelligence & Artificial Intelligence.',
    highlights: ['Advanced Network Security', 'Advanced Programming (J2EE)', 'Business Intelligence & AI'],
    tags: ['Cybersecurity', 'J2EE', 'Databases', 'AI'],
    order: 3,
  },
  {
    role: 'Full-Stack Web Developer (Intern)',
    company: 'Data FC',
    location: 'Safi, Morocco',
    type: 'work',
    period: 'Apr 2024 — Jun 2024',
    description:
      'Designed and developed a corporate training-management web application with role-based access and REST API integration.',
    highlights: [
      'Clients could browse training sessions and submit registration requests',
      'Backend with Laravel / Inertia.js, frontend with Vue.js',
    ],
    tags: ['Laravel', 'Inertia.js', 'Vue.js', 'REST API'],
    order: 4,
  },
  {
    role: 'Cisco CCNA 1, 2 & 3',
    company: 'Cisco Networking Academy',
    type: 'certification',
    period: '2023 — 2025',
    description:
      'Introduction to Networks (2023), Switching, Routing & Wireless Essentials (2024), and Advanced Network Security (2025).',
    highlights: [
      'CCNA 1 — Introduction to Networks',
      'CCNA 2 — Switching, Routing & Wireless Essentials',
      'CCNA 3 — Advanced Network Security',
    ],
    tags: ['Cisco', 'Networking', 'Security'],
    order: 5,
  },
  {
    role: 'University Diploma of Technology (DUT) — Computer Engineering',
    company: 'Higher School of Technology (EST), Safi',
    type: 'education',
    period: '2022 — 2024',
    description:
      'Key modules: Algorithms, C Programming, Computer Networks, Operating Systems, Object-Oriented Programming, UML and Project Management.',
    highlights: ['Algorithms & C programming', 'Operating systems & networks', 'OOP & UML modeling'],
    tags: ['C', 'Algorithms', 'Networks', 'OOP'],
    order: 6,
  },
  {
    role: 'Full-Stack Web Developer (Intern)',
    company: 'Devosoft',
    location: 'Safi, Morocco',
    type: 'work',
    period: 'Jul 2023 — Sep 2023',
    description:
      'Built an online examination system with authentication and access control, plus a static video-games website.',
    highlights: ['Online exam system with Laravel / PHP, JavaScript & MySQL', 'Static games site with HTML, CSS & Bootstrap'],
    tags: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    order: 7,
  },
]

const PROJECTS = [
  {
    title: 'CI/CD & Supply-Chain Security Hardening',
    summary:
      'Hardened a GitLab CI/CD pipeline and Docker images for a MERN e-commerce app — vulnerable baseline → real attacks → measured attack-surface reduction.',
    description:
      'Built a deliberately vulnerable baseline, executed real attack scenarios (leaked / committed secrets, insecure pipeline steps), then hardened the GitLab CI/CD pipeline and Docker images and measured the resulting reduction in attack surface.',
    tags: ['GitLab CI', 'Docker', 'Node.js', 'React', 'MongoDB'],
    category: 'Security',
    role: 'Security Engineer',
    period: '2026',
    highlights: [
      'Vulnerable → attacks → hardened → measured methodology',
      'Secret detection & committed-secret remediation',
      'Container and pipeline hardening with measured impact',
    ],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: true,
    status: 'published',
    order: 0,
  },
  {
    title: 'Collaborative Blood Donation Platform',
    summary:
      'A web admin + Flutter donor app for managing blood-donation campaigns, with center localization and donor–admin workflows.',
    description:
      "Bachelor's final project: a web application for administration and a Flutter mobile app for donors. Features donation-campaign management, center localization via MapBox, and donor–administration interaction.",
    tags: ['Laravel', 'Nuxt.js', 'Flutter', 'Tailwind CSS', 'MySQL', 'MapBox'],
    category: 'Mobile',
    role: 'Full-Stack Developer',
    period: '2025',
    highlights: ['Donation-campaign management', 'Center localization with MapBox', 'Web admin + cross-platform mobile app'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: true,
    status: 'published',
    order: 1,
  },
  {
    title: 'Children’s School-Route Tracking App',
    summary:
      'Real-time tracking that lets parents follow their children’s school routes, with a web admin panel and a mobile app.',
    description:
      'DUT final project: a system that lets parents track their children’s school routes in real time, with a web admin panel and a Flutter mobile application for parents.',
    tags: ['Laravel', 'Vue.js', 'Flutter', 'MapBox', 'Tailwind CSS'],
    category: 'Mobile',
    role: 'Full-Stack Developer',
    period: '2024',
    highlights: ['Real-time route tracking', 'Web admin panel', 'Mobile app for parents'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: true,
    status: 'published',
    order: 2,
  },
  {
    title: 'Legakte — Online Admin Procedures Platform',
    summary:
      'A platform to manage administrative procedures online — secure auth, identity verification and bank / payment-API integrations.',
    description:
      'Freelance project: a web app to manage administrative procedures online — secure authentication, multi-step forms, a personalized dashboard, online credit purchases, identity verification (Veriff) and bank / payment APIs (Stripe, BCE, BNP).',
    tags: ['Laravel', 'Vue.js', 'Stripe', 'Veriff'],
    category: 'Full-Stack',
    role: 'Freelance Developer',
    period: '2025',
    highlights: ['Secure authentication & multi-step forms', 'Stripe / BCE / BNP payment integrations', 'Veriff identity verification'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: false,
    status: 'published',
    order: 3,
  },
  {
    title: 'Corporate Training Management',
    summary:
      'A training-management web app where clients browse sessions and submit registration requests, with role-based access.',
    description:
      'Internship project at Data FC: a corporate training-management application — clients view available training sessions and submit registration requests. Built with Laravel / Inertia.js and Vue.js with REST API integration.',
    tags: ['Laravel', 'Inertia.js', 'Vue.js', 'REST API'],
    category: 'Full-Stack',
    role: 'Full-Stack Intern',
    period: '2024',
    highlights: ['Browse training sessions', 'Registration requests', 'Role-based access & REST API'],
    links: { live: '', github: 'https://github.com/elmahdi004', demo: '' },
    featured: false,
    status: 'published',
    order: 4,
  },
  {
    title: 'Online Examination System',
    summary: 'An online exam platform with authentication and access control, built during an internship at Devosoft.',
    description:
      'Internship project at Devosoft: an online examination system with authentication and access control, built with Laravel / PHP, JavaScript and MySQL.',
    tags: ['Laravel', 'PHP', 'JavaScript', 'MySQL'],
    category: 'Full-Stack',
    role: 'Full-Stack Intern',
    period: '2023',
    highlights: ['Authentication & access control', 'Exam workflow', 'Laravel / PHP / MySQL stack'],
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
    for (const p of PROJECTS) await Project.create(p) // create() runs the slug hook
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
