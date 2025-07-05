
import { useState, useEffect } from 'react'
import { CanvasElement } from '@/components/editor/types'
import { Project } from '@/types/project'
import { projectService } from '@/services/projectService'

export const useProjects = (userId: string | undefined) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchProjects()
    } else {
      setLoading(false)
    }
  }, [userId])

  const fetchProjects = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const { data, error } = await projectService.fetchProjects(userId)
      
      if (error) {
        console.error(error)
      } else {
        setProjects(data || [])
      }
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async (name: string, elements: CanvasElement[], projectId?: string) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      const { data, error } = await projectService.saveProject(userId, name, elements, projectId)
      
      if (!error) {
        await fetchProjects()
      }
      
      return { data, error }
    } catch (err) {
      console.error('Unexpected error in saveProject:', err)
      return { error: 'Erro inesperado ao salvar projeto' }
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      const { error } = await projectService.deleteProject(userId, projectId)
      
      if (!error) {
        await fetchProjects()
      }
      
      return { error }
    } catch (err) {
      console.error('Unexpected error in deleteProject:', err)
      return { error: 'Erro inesperado ao deletar projeto' }
    }
  }

  const getProject = async (projectId: string) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      return await projectService.getProject(userId, projectId)
    } catch (err) {
      console.error('Unexpected error in getProject:', err)
      return { error: 'Erro inesperado ao carregar projeto' }
    }
  }

  return {
    projects,
    loading,
    saveProject,
    deleteProject,
    getProject,
    fetchProjects
  }
}
