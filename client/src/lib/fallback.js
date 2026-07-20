// Single source of truth for all portfolio content: src/data/portfolio.json
//
// Edit that JSON file and everything updates — the UI, the offline AI
// assistant, and the SEO markup generated into dist/index.html at build time
// (see scripts/generate-seo.mjs). Nothing is hand-written into the HTML.
//
// These named exports are kept so existing imports keep working unchanged.

import data from '../data/portfolio.json'

export const SITE = data.site
export const FALLBACK_PROFILE = data.profile
export const FALLBACK_SKILLS = data.skills
export const FALLBACK_EXPERIENCES = data.experiences
export const FALLBACK_PROJECTS = data.projects

export default data
