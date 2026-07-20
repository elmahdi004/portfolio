// "Static mode" — lets the whole portfolio run with NO backend (free static
// hosting). Enabled by VITE_STATIC=true (set in .env.production).
//
//  • Content        → served straight from lib/fallback.js (no network call)
//  • GitHub stats   → fetched directly from the public GitHub API (CORS-ok)
//  • Contact form   → Web3Forms if VITE_WEB3FORMS_KEY is set, else mailto:
//  • AI assistant   → local keyword responder built from the same data

import {
  FALLBACK_PROFILE,
  FALLBACK_SKILLS,
  FALLBACK_PROJECTS,
  FALLBACK_EXPERIENCES,
} from './fallback.js'

export const IS_STATIC = import.meta.env.VITE_STATIC === 'true'

export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'elmahdi004'

/** Same response shape the backend proxy returned, built client-side. */
export async function fetchGithubDirect(username = GITHUB_USERNAME) {
  const [uRes, rRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
  ])
  if (!uRes.ok) throw new Error(`GitHub user "${username}" not found`)

  const user = await uRes.json()
  const repos = rRes.ok ? await rRes.json() : []
  const owned = repos.filter((r) => !r.fork)

  const totals = {
    stars: owned.reduce((s, r) => s + (r.stargazers_count || 0), 0),
    forks: owned.reduce((s, r) => s + (r.forks_count || 0), 0),
    repos: user.public_repos,
  }

  const langCount = {}
  for (const r of owned) if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1
  const langTotal = Object.values(langCount).reduce((a, b) => a + b, 0) || 1
  const languages = Object.entries(langCount)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / langTotal) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const topRepos = [...owned]
    .sort(
      (a, b) =>
        b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at)
    )
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      url: r.html_url,
      updatedAt: r.updated_at,
      topics: r.topics || [],
    }))

  return {
    user: {
      login: user.login,
      name: user.name,
      avatar_url: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      public_repos: user.public_repos,
      html_url: user.html_url,
      company: user.company,
      location: user.location,
      created_at: user.created_at,
    },
    totals,
    languages,
    topRepos,
    contributions: null,
    cached: false,
  }
}

/** Contact form without a backend. */
export async function submitContactStatic({ name, email, subject, message }) {
  const key = import.meta.env.VITE_WEB3FORMS_KEY
  if (key) {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: key,
        name,
        email,
        subject: subject || `Portfolio message from ${name}`,
        message,
        from_name: 'Portfolio',
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data.success) throw new Error(data.message || 'Could not send the message')
    return data
  }

  // No form service configured → hand off to the visitor's mail client.
  const to = FALLBACK_PROFILE.email
  const s = encodeURIComponent(subject || `Portfolio message from ${name}`)
  const b = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
  window.location.href = `mailto:${to}?subject=${s}&body=${b}`
  return { mailto: true }
}

/** Offline AI assistant — keyword routing over the real CV data (EN/FR/AR). */
export function localAssistantAnswer(message) {
  const q = (message || '').toLowerCase()
  const p = FALLBACK_PROFILE
  const name = p.name

  if (/contact|email|reach|hire|available|opportunit|contact|recrut|embauch|disponib|تواصل|توظيف|بريد/.test(q)) {
    return `You can reach ${name} at ${p.email} — or just use the contact form on this page.${
      p.availableForWork ? " He's currently open to new opportunities!" : ''
    }`
  }
  if (/skill|tech|stack|tool|language|compétence|competence|techno|outil|مهارات|تقني/.test(q)) {
    return `${name} works with ${FALLBACK_SKILLS.slice(0, 12).map((s) => s.name).join(', ')} — and more. Scroll to the Skills section for the full stack.`
  }
  if (/project|built|made|portfolio|projet|réalis|realis|مشاريع|مشروع/.test(q)) {
    return `${name} has built ${FALLBACK_PROJECTS.slice(0, 3).map((x) => x.title).join(', ')} and more. Check the Projects section for details.`
  }
  if (/experience|job|career|company|role|work|expérience|experience|travail|entreprise|خبرة|عمل/.test(q)) {
    const e = FALLBACK_EXPERIENCES[0]
    return `Most recently, ${name} works as ${e.role} at ${e.company}. See the full timeline in the Journey section.`
  }
  if (/education|study|degree|school|univers|étude|etude|diplôme|diplome|école|دراسة|شهادة|جامعة/.test(q)) {
    return `${name} is pursuing a State Engineer degree in Intelligent Networks & Cybersecurity at ENSA Khouribga (2025–2027), after a Bachelor in Information Systems & Network Engineering and a DUT in Computer Engineering at EST Safi. He's also CCNA 1–3 certified.`
  }
  if (/security|vulnerab|fuzz|hack|pentest|sécurit|securit|أمن|ثغرات/.test(q)) {
    return `Security is ${name}'s core focus: as a vulnerability-research engineer he injects OSS-fuzz-style vulnerabilities into code repositories and authors the correct, validated patches used to train frontier AI code-repair models — plus CI/CD and supply-chain hardening work.`
  }
  if (/who|about|tell me|yourself|bio|qui es|présent|presente|من هو|عن/.test(q)) {
    return p.bio.split('\n\n')[0]
  }
  return `I can tell you about ${name}'s skills, projects, experience, education, security work, or how to get in touch — what would you like to know?`
}
