import { useQuery } from '@tanstack/react-query'
import api from '../lib/api.js'

const get = (url) => api.get(url).then((r) => r.data)

// Content queries don't retry: if the DB is down a retry won't help, and it
// would just double the wait on the public page.
export const useProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: () => get('/profile'), retry: 0 })

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: () => get('/projects'), retry: 0 })

export const useExperiences = () =>
  useQuery({ queryKey: ['experiences'], queryFn: () => get('/experiences'), retry: 0 })

export const useSkills = () =>
  useQuery({ queryKey: ['skills'], queryFn: () => get('/skills'), retry: 0 })

export const useGithub = () =>
  useQuery({
    queryKey: ['github'],
    queryFn: () => get('/github/stats'),
    staleTime: 30 * 60 * 1000,
    retry: 0,
  })
