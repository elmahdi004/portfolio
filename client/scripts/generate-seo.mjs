#!/usr/bin/env node
/**
 * Generates every SEO artifact from ONE source: src/data/portfolio.json
 *
 *   • injects <title>, meta tags, Open Graph, Twitter cards and JSON-LD
 *     structured data into dist/index.html
 *   • injects a crawlable <noscript> version of the content (for bots that
 *     don't run JavaScript — Bing, LinkedIn, WhatsApp, …)
 *   • writes dist/robots.txt and dist/sitemap.xml
 *
 * Runs automatically after `vite build` (see package.json → "build").
 * Never hand-edit SEO markup in index.html — edit the JSON instead.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist')
const indexPath = resolve(dist, 'index.html')

if (!existsSync(indexPath)) {
  console.error('✖ dist/index.html not found — run `vite build` first.')
  process.exit(1)
}

const data = JSON.parse(readFileSync(resolve(root, 'src/data/portfolio.json'), 'utf8'))
const { site, profile, skills, experiences, projects } = data

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const url = site.url.replace(/\/$/, '')
const abs = (p) => (String(p).startsWith('http') ? p : `${url}${p}`)
const today = new Date().toISOString().slice(0, 10)

const education = experiences.filter((e) => e.type === 'education')
const certs = experiences.filter((e) => e.type === 'certification')
const jobs = experiences.filter((e) => e.type === 'work')

/* ── Structured data (the biggest lever for a personal-name query) ────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${url}/#person`,
      name: profile.name,
      alternateName: profile.alternateNames,
      givenName: profile.givenName,
      familyName: profile.familyName,
      url: `${url}/`,
      image: abs(site.ogImage),
      jobTitle: profile.title,
      description: profile.bio.split('\n\n')[0],
      email: `mailto:${profile.email}`,
      nationality: { '@type': 'Country', name: profile.nationality },
      address: {
        '@type': 'PostalAddress',
        addressLocality: profile.addressLocality,
        addressCountry: profile.addressCountry,
      },
      sameAs: [profile.socials.github, profile.socials.linkedin].filter(Boolean),
      knowsLanguage: site.languages,
      knowsAbout: [...new Set(skills.map((s) => s.name))],
      alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.company })),
      hasCredential: certs.flatMap((c) =>
        (c.highlights?.length ? c.highlights : [c.role]).map((h) => ({
          '@type': 'EducationalOccupationalCredential',
          name: h,
        }))
      ),
      worksFor: jobs
        .filter((j) => j.current)
        .map((j) => ({ '@type': 'Organization', name: j.company })),
    },
    {
      '@type': 'WebSite',
      '@id': `${url}/#website`,
      url: `${url}/`,
      name: `${profile.name} — Portfolio`,
      description: site.description,
      inLanguage: site.languages,
      about: { '@id': `${url}/#person` },
      publisher: { '@id': `${url}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${url}/#profilepage`,
      url: `${url}/`,
      name: site.title,
      isPartOf: { '@id': `${url}/#website` },
      mainEntity: { '@id': `${url}/#person` },
    },
  ],
}

/* ── <head> block ─────────────────────────────────────────────────────── */
const head = `
    <meta name="description" content="${esc(site.description)}" />
    <meta name="author" content="${esc(profile.name)}" />
    <meta name="keywords" content="${esc(site.keywords.join(', '))}" />
    <link rel="canonical" href="${url}/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <meta property="og:type" content="profile" />
    <meta property="og:site_name" content="${esc(profile.name)}" />
    <meta property="og:title" content="${esc(site.title)}" />
    <meta property="og:description" content="${esc(site.shortDescription)}" />
    <meta property="og:url" content="${url}/" />
    <meta property="og:image" content="${abs(site.ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(site.title)}" />
    <meta property="og:locale" content="${esc(site.locale)}" />
${site.altLocales.map((l) => `    <meta property="og:locale:alternate" content="${esc(l)}" />`).join('\n')}
    <meta property="profile:first_name" content="${esc(profile.givenName)}" />
    <meta property="profile:last_name" content="${esc(profile.familyName)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(site.title)}" />
    <meta name="twitter:description" content="${esc(site.shortDescription)}" />
    <meta name="twitter:image" content="${abs(site.ogImage)}" />

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)
  .split('\n')
  .map((l) => '      ' + l)
  .join('\n')}
    </script>`

/* ── <noscript> crawlable content ─────────────────────────────────────── */
const li = (items) => items.map((i) => `          <li>${esc(i)}</li>`).join('\n')

const noscript = `<noscript>
      <div style="max-width:720px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif">
        <h1>${esc(profile.name)} — ${esc(profile.title)}</h1>
${profile.bio
  .split('\n\n')
  .map((p) => `        <p>${esc(p)}</p>`)
  .join('\n')}

        <h2>Experience</h2>
        <ul>
${li(jobs.map((e) => `${e.role} — ${e.company}${e.period ? `, ${e.period}` : ''}`))}
        </ul>

        <h2>Education &amp; Certifications</h2>
        <ul>
${li([...education, ...certs].map((e) => `${e.role} — ${e.company}${e.period ? `, ${e.period}` : ''}`))}
        </ul>

        <h2>Projects</h2>
        <ul>
${li(projects.map((p) => `${p.title} — ${p.summary}`))}
        </ul>

        <h2>Skills</h2>
        <p>${esc(skills.map((s) => s.name).join(' · '))}</p>

        <h2>Contact</h2>
        <p>
          ${esc(profile.location)} —
          <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a> ·
          <a href="${esc(profile.socials.github)}">GitHub</a> ·
          <a href="${esc(profile.socials.linkedin)}">LinkedIn</a>
        </p>
      </div>
    </noscript>`

/* ── Inject ───────────────────────────────────────────────────────────── */
let html = readFileSync(indexPath, 'utf8')

html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(site.title)}</title>`)

if (!html.includes('<!--SEO_HEAD-->') || !html.includes('<!--SEO_BODY-->')) {
  console.error('✖ SEO markers missing from index.html (<!--SEO_HEAD--> / <!--SEO_BODY-->).')
  process.exit(1)
}

html = html.replace('<!--SEO_HEAD-->', head.trim())
html = html.replace('<!--SEO_BODY-->', noscript)
writeFileSync(indexPath, html, 'utf8')

/* ── robots.txt + sitemap.xml (domain comes from the JSON too) ─────────── */
writeFileSync(
  resolve(dist, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${url}/sitemap.xml
`,
  'utf8'
)

writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`,
  'utf8'
)

console.log(`✔ SEO generated from portfolio.json → ${url}/`)
console.log(`  · title, meta, Open Graph, Twitter, JSON-LD (Person + WebSite + ProfilePage)`)
console.log(`  · <noscript> fallback: ${jobs.length} roles, ${projects.length} projects, ${skills.length} skills`)
console.log(`  · robots.txt + sitemap.xml`)
