// Client-side fallback content so the portfolio looks complete even before the
// database is connected. Real API data takes precedence everywhere this is used.

export const FALLBACK_PROFILE = {
  name: 'El Mahdi Bellaziz',
  title: 'DevSecOps Engineer & Full-Stack Developer',
  roles: [
    'DevSecOps Engineer',
    'Full-Stack Developer',
    // 'Cloud & Security Enthusiast',
    'Automation Builder',
  ],
  tagline: 'I build secure, scalable systems — and break them before attackers can.',
  bio: `I'm a DevSecOps engineer and full-stack developer who lives at the intersection of shipping fast and staying secure. I design CI/CD pipelines with security baked in, harden cloud-native infrastructure, and build polished MERN applications end to end.

From threat-modeling a deployment to crafting a delightful React UI, I care about the whole lifecycle — secure by design, automated by default, and observable in production.`,
  location: '🌍 Remote · Open to relocation',
  email: 'elmahdibellaziz@gmail.com',
  availableForWork: true,
  yearsExperience: 3,
  socials: {
    github: 'https://github.com/elmahdi004',
    linkedin: 'https://www.linkedin.com/in/elmahdibellaziz',
    email: 'elmahdibellaziz@gmail.com',
  },
  stats: [
    { label: 'Projects Shipped', value: '20+' },
    { label: 'Years Experience', value: '3+' },
    { label: 'Technologies', value: '30+' },
    { label: 'Pipelines Hardened', value: '15+' },
  ],
}

export const FALLBACK_SKILLS = [
  { name: 'JavaScript', category: 'Languages', level: 92, color: '#f7df1e' },
  { name: 'TypeScript', category: 'Languages', level: 88, color: '#3178c6' },
  { name: 'Python', category: 'Languages', level: 85, color: '#3776ab' },
  { name: 'Bash', category: 'Languages', level: 80, color: '#4eaa25' },
  { name: 'React', category: 'Frontend', level: 92, color: '#61dafb' },
  { name: 'Tailwind CSS', category: 'Frontend', level: 90, color: '#38bdf8' },
  { name: 'Next.js', category: 'Frontend', level: 82, color: '#a78bfa' },
  { name: 'Framer Motion', category: 'Frontend', level: 80, color: '#ff4d8d' },
  { name: 'Node.js', category: 'Backend', level: 90, color: '#5fa04e' },
  { name: 'Express', category: 'Backend', level: 88, color: '#a3a3a3' },
  { name: 'MongoDB', category: 'Backend', level: 85, color: '#47a248' },
  { name: 'PostgreSQL', category: 'Backend', level: 78, color: '#4169e1' },
  { name: 'Docker', category: 'DevOps', level: 90, color: '#2496ed' },
  { name: 'Kubernetes', category: 'DevOps', level: 78, color: '#326ce5' },
  { name: 'GitHub Actions', category: 'DevOps', level: 88, color: '#60a5fa' },
  { name: 'GitLab CI', category: 'DevOps', level: 85, color: '#fc6d26' },
  { name: 'Terraform', category: 'DevOps', level: 75, color: '#a855f7' },
  { name: 'OWASP / AppSec', category: 'Security', level: 86, color: '#f43f5e' },
  { name: 'SAST / DAST', category: 'Security', level: 82, color: '#fb7185' },
  { name: 'Trivy & Snyk', category: 'Security', level: 84, color: '#818cf8' },
  { name: 'JWT / OAuth2', category: 'Security', level: 88, color: '#e879f9' },
  { name: 'AWS', category: 'Cloud', level: 80, color: '#ff9900' },
  { name: 'Linux', category: 'Cloud', level: 88, color: '#fcc419' },
]

export const FALLBACK_EXPERIENCES = [
  {
    role: 'DevSecOps Engineer',
    company: 'Confidential / Freelance',
    location: 'Remote',
    type: 'work',
    current: true,
    period: '2024 — Present',
    description:
      'Embed security across the SDLC: design hardened CI/CD pipelines, automate vulnerability scanning, and ship cloud-native MERN apps.',
    highlights: [
      'Hardened GitLab CI/CD with SAST, DAST, secret-scanning & image-scanning gates',
      'Containerized and orchestrated services with Docker & Kubernetes',
      'Cut critical vulnerabilities by integrating Trivy & Snyk into the build',
    ],
    tags: ['DevSecOps', 'CI/CD', 'Docker', 'Kubernetes'],
  },
  {
    role: 'Full-Stack Developer (MERN)',
    company: 'Independent Projects',
    location: 'Remote',
    type: 'work',
    period: '2023 — 2024',
    description:
      'Built and shipped full-stack web apps with React, Node.js, Express and MongoDB, focused on clean architecture and DX.',
    highlights: [
      'Designed REST APIs and responsive React front-ends',
      'Implemented JWT/OAuth2 auth and role-based access control',
      'Automated deployments with GitHub Actions',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'Express'],
  },
  {
    role: 'Telecommunications & Computer Engineering',
    company: 'Engineering School',
    type: 'education',
    period: '2021 — 2025',
    description:
      'Engineering degree covering networks, telecommunications, systems and software — the foundation for a security-first mindset.',
    highlights: ['Networks & protocols', 'Systems programming', 'Software engineering'],
    tags: ['Networking', 'Telecom', 'Systems'],
  },
  {
    role: 'Cisco Certified DevNet Associate',
    company: 'Cisco',
    type: 'certification',
    period: '2025',
    description: 'Network automation, APIs, and infrastructure-as-code on Cisco platforms.',
    highlights: ['REST APIs', 'Automation', 'Infrastructure as Code'],
    tags: ['Cisco', 'DevNet', 'Automation'],
  },
]

export const FALLBACK_PROJECTS = [
  {
    title: 'Secure CI/CD Pipeline Hardening',
    summary:
      'End-to-end hardening of a GitLab CI/CD pipeline for a MERN e-commerce app — vulnerable baseline to attack-resistant build.',
    description:
      'Take a deliberately vulnerable MERN application, demonstrate real attacks, then harden the pipeline step by step (secret scanning, SAST/DAST, dependency & container scanning, least-privilege runners) and measure the improvement.',
    tags: ['GitLab CI', 'Docker', 'Trivy', 'SAST', 'DAST', 'MERN'],
    category: 'Security',
    period: '2025',
    highlights: [
      'Vulnerable → attacks → hardened → measured methodology',
      'Container image scanning + supply-chain integrity checks',
      'Secret detection and least-privilege CI runners',
    ],
    links: { github: 'https://github.com/elmahdi004' },
    featured: true,
  },
  {
    title: 'Aurora Portfolio (this site)',
    summary:
      'A MERN portfolio with an aurora-glass UI, admin CMS, ⌘K command palette, live GitHub stats and an AI "ask me" assistant.',
    description:
      'React + Vite + Tailwind + Framer Motion on the front, Express + MongoDB on the back. JWT-secured admin, a Claude-powered chat assistant, dark/light theming and a fully responsive aurora design system.',
    tags: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'AI'],
    category: 'Web',
    period: '2026',
    highlights: [
      'Glassmorphism + animated aurora design system',
      'Admin dashboard with full CRUD',
      'AI assistant grounded in real profile data',
    ],
    links: { github: 'https://github.com/elmahdi004' },
    featured: true,
  },
  {
    title: 'Container Vulnerability Dashboard',
    summary: 'Aggregates Trivy/Grype scan results across container images and surfaces risk trends over time.',
    description:
      'Collects scanner output in CI, stores findings, and visualizes severity distribution, drift and remediation progress for a fleet of images.',
    tags: ['Trivy', 'Docker', 'React', 'Node.js'],
    category: 'DevOps',
    period: '2025',
    highlights: ['CVE trend analysis', 'Severity heatmaps', 'CI integration'],
    links: { github: 'https://github.com/elmahdi004' },
    featured: true,
  },
  {
    title: 'Zero-Trust Auth Microservice',
    summary: 'Reusable auth microservice with JWT, refresh-token rotation, RBAC and rate limiting.',
    description:
      'Stateless auth service exposing register/login/refresh endpoints with httpOnly cookies, brute-force protection and audit logging — drop-in for MERN stacks.',
    tags: ['Node.js', 'JWT', 'OAuth2', 'Security'],
    category: 'Security',
    period: '2024',
    highlights: ['Refresh-token rotation', 'Role-based access control', 'Brute-force protection'],
    links: { github: 'https://github.com/elmahdi004' },
    featured: false,
  },
  {
    title: 'Infra-as-Code Starter Kit',
    summary: 'Terraform + Docker Compose templates to spin up a hardened, observable web stack in minutes.',
    description:
      'Opinionated IaC modules with secure defaults, reverse proxy, TLS, and a monitoring baseline — a fast path from zero to a production-shaped environment.',
    tags: ['Terraform', 'Docker', 'Nginx', 'IaC'],
    category: 'DevOps',
    period: '2024',
    highlights: ['Reusable modules', 'Secure defaults', 'Built-in observability'],
    links: { github: 'https://github.com/elmahdi004' },
    featured: false,
  },
  {
    title: 'Realtime Network Monitor',
    summary: 'A WebSocket dashboard visualizing live network/telemetry data with alerting.',
    description:
      'Streams device metrics over WebSockets into a React dashboard with thresholds and alerts — bridging a telecom background with modern web tooling.',
    tags: ['WebSockets', 'React', 'Node.js', 'Telecom'],
    category: 'Web',
    period: '2023',
    highlights: ['Live streaming charts', 'Threshold alerts', 'Responsive UI'],
    links: { github: 'https://github.com/elmahdi004' },
    featured: false,
  },
]
