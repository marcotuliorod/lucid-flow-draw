
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CanvasElement } from '@/components/editor/types'
import { projectSchema, sanitizeProjectName, isValidProjectId, createSecureError } from '@/lib/validation'

export interface Project {
  id: string
  name: string
  elements: CanvasElement[]
  created_at: string
  updated_at: string
  user_id: string
}

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
      console.log('Fetching projects for user')
      
      const query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Error fetching projects:', error.message)
        const userMessage = createSecureError('Erro ao carregar projetos', import.meta.env.DEV)
        console.error(userMessage)
      } else {
        console.log('Projects fetched successfully')
        setProjects(data || [])
      }
    } catch (err) {
      console.error('Unexpected error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveProject = async (name: string, elements: CanvasElement[], projectId?: string) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      // Sanitize and validate inputs
      const sanitizedName = sanitizeProjectName(name)
      
      const validationResult = projectSchema.safeParse({
        name: sanitizedName,
        elements
      })

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message
        return { error: errorMessage }
      }

      // Validate project ID if updating
      if (projectId && !isValidProjectId(projectId)) {
        return { error: 'ID do projeto inválido' }
      }

      console.log('Saving project with validation passed')
      
      const projectData = {
        name: sanitizedName,
        elements: validationResult.data.elements,
        user_id: userId,
        updated_at: new Date().toISOString()
      }

      let result
      if (projectId) {
        // Update existing project
        const query = supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .eq('user_id', userId)
          .select()
          .single()
        
        result = await query
      } else {
        // Create new project
        const query = supabase
          .from('projects')
          .insert({ ...projectData, created_at: new Date().toISOString() })
          .select()
          .single()
        
        result = await query
      }

      if (result.error) {
        console.error('Error saving project:', result.error.message)
        const userMessage = createSecureError('Erro ao salvar projeto', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Project saved successfully')
      await fetchProjects()
      return { data: result.data }
    } catch (err) {
      console.error('Unexpected error saving project:', err)
      const userMessage = createSecureError('Erro inesperado ao salvar projeto', import.meta.env.DEV)
      return { error: userMessage }
    }
  }

  const deleteProject = async (projectId: string) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      // Validate project ID
      if (!isValidProjectId(projectId)) {
        return { error: 'ID do projeto inválido' }
      }

      console.log('Deleting project with validation passed')
      
      const query = supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId)

      const { error } = await query

      if (error) {
        console.error('Error deleting project:', error.message)
        const userMessage = createSecureError('Erro ao deletar projeto', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Project deleted successfully')
      await fetchProjects()
      return { error: null }
    } catch (err) {
      console.error('Unexpected error deleting project:', err)
      const userMessage = createSecureError('Erro inesperado ao deletar projeto', import.meta.env.DEV)
      return { error: userMessage }
    }
  }

  const getProject = async (projectId: string) => {
    if (!userId) return { error: 'User not authenticated' }

    try {
      // Validate project ID
      if (!isValidProjectId(projectId)) {
        return { error: 'ID do projeto inválido' }
      }

      console.log('Getting project with validation passed')
      
      const query = supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single()

      const { data, error } = await query

      if (error) {
        console.error('Error fetching project:', error.message)
        const userMessage = createSecureError('Erro ao carregar projeto', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Project fetched successfully')
      return { data, error: null }
    } catch (err) {
      console.error('Unexpected error fetching project:', err)
      const userMessage = createSecureError('Erro inesperado ao carregar projeto', import.meta.env.DEV)
      return { error: userMessage }
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
