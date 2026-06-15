import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api.js'

const get = (url) => api.get(url).then((r) => r.data)

// Admin reads (projects ?all=1 includes drafts)
export const useAdminProjects = () =>
  useQuery({ queryKey: ['admin', 'projects'], queryFn: () => get('/projects?all=1') })
export const useAdminExperiences = () =>
  useQuery({ queryKey: ['admin', 'experiences'], queryFn: () => get('/experiences') })
export const useAdminSkills = () =>
  useQuery({ queryKey: ['admin', 'skills'], queryFn: () => get('/skills') })
export const useAdminProfile = () =>
  useQuery({ queryKey: ['admin', 'profile'], queryFn: () => get('/profile') })
export const useMessages = () =>
  useQuery({ queryKey: ['admin', 'messages'], queryFn: () => get('/contact') })

// Generic CRUD for projects | experiences | skills
export function useCrud(resource) {
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', resource] })
    qc.invalidateQueries({ queryKey: [resource] }) // matching public query
  }
  const path = `/${resource}`
  return {
    create: useMutation({
      mutationFn: (body) => api.post(path, body).then((r) => r.data),
      onSuccess: invalidate,
    }),
    update: useMutation({
      mutationFn: ({ id, ...body }) => api.put(`${path}/${id}`, body).then((r) => r.data),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id) => api.delete(`${path}/${id}`).then((r) => r.data),
      onSuccess: invalidate,
    }),
  }
}

// Profile is a singleton (PUT /profile)
export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => api.put('/profile', body).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'profile'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

// Messages: toggle read / delete
export function useMessageActions() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'messages'] })
  return {
    setRead: useMutation({
      mutationFn: ({ id, read }) => api.patch(`/contact/${id}`, { read }).then((r) => r.data),
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: (id) => api.delete(`/contact/${id}`).then((r) => r.data),
      onSuccess: invalidate,
    }),
  }
}
