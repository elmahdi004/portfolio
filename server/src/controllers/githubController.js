import { asyncHandler } from '../utils/asyncHandler.js'

const CACHE_TTL = 30 * 60 * 1000 // 30 minutes
let cache = { key: null, at: 0, data: null }

function ghHeaders() {
  const h = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'bellaziz-portfolio',
  }
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return h
}

// Real contribution calendar needs the GraphQL API + a token. Returns null otherwise.
async function fetchContributions(username) {
  if (!process.env.GITHUB_TOKEN) return null
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount color weekday}}}}}}`
  try {
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { login: username } }),
    })
    if (!r.ok) return null
    const j = await r.json()
    return j?.data?.user?.contributionsCollection?.contributionCalendar || null
  } catch {
    return null
  }
}

// GET /api/github/stats
export const getGithubStats = asyncHandler(async (req, res) => {
  const username = process.env.GITHUB_USERNAME
  if (!username) {
    res.status(400)
    throw new Error('GITHUB_USERNAME is not configured on the server')
  }

  if (cache.data && cache.key === username && Date.now() - cache.at < CACHE_TTL) {
    return res.json({ ...cache.data, cached: true })
  }

  const [userR, reposR] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers: ghHeaders() }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
      headers: ghHeaders(),
    }),
  ])

  if (!userR.ok) {
    res.status(userR.status === 404 ? 404 : 502)
    throw new Error(
      userR.status === 404
        ? `GitHub user "${username}" not found`
        : `GitHub API error (${userR.status}). Try setting GITHUB_TOKEN.`
    )
  }

  const user = await userR.json()
  const repos = reposR.ok ? await reposR.json() : []
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
        b.stargazers_count - a.stargazers_count ||
        new Date(b.updated_at) - new Date(a.updated_at)
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

  const contributions = await fetchContributions(username)

  const data = {
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
    contributions,
    cached: false,
  }

  cache = { key: username, at: Date.now(), data }
  res.json(data)
})
