import { useQuery } from '@tanstack/react-query'
import api from '../lib/api.js'
import { IS_STATIC, fetchGithubDirect } from '../lib/staticMode.js'
import {
  FALLBACK_PROFILE,
  FALLBACK_PROJECTS,
  FALLBACK_EXPERIENCES,
  FALLBACK_SKILLS,
} from '../lib/fallback.js'

const get = (url) => api.get(url).then((r) => r.data)

// In static mode (no backend) serve the bundled content directly — no network
// call, no failed request. Otherwise hit the API. Content queries never retry:
// if the DB is down a retry won't help, it would just double the wait.
const useContent = (key, url, staticData) =>
  useQuery({
    queryKey: [key],
    queryFn: IS_STATIC ? async () => staticData : () => get(url),
    retry: 0,
    staleTime: IS_STATIC ? Infinity : 60_000,
  })

export const useProfile = () => useContent('profile', '/profile', FALLBACK_PROFILE)
export const useProjects = () => useContent('projects', '/projects', FALLBACK_PROJECTS)
export const useExperiences = () => useContent('experiences', '/experiences', FALLBACK_EXPERIENCES)
export const useSkills = () => useContent('skills', '/skills', FALLBACK_SKILLS)

// GitHub works without a backend: the public API is CORS-enabled.
export const useGithub = () =>
  useQuery({
    queryKey: ['github'],
    queryFn: IS_STATIC ? () => fetchGithubDirect() : () => get('/github/stats'),
    staleTime: 30 * 60 * 1000,
    retry: 0,
  })
