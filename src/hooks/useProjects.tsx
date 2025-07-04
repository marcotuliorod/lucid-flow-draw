
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CanvasElement } from '@/components/editor/types'

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
    }
  }, [userId])

  const fetchProjects = async () => {
    if (!userId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const saveProject = async (name: string, elements: CanvasElement[], projectId?: string) => {
    if (!userId) return { error: 'User not authenticated' }

    const projectData = {
      name,
      elements,
      user_id: userId,
      updated_at: new Date().toISOString()
    }

    let result
    if (projectId) {
      // Update existing project
      result = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId)
        .eq('user_id', userId)
        .select()
        .single()
    } else {
      // Create new project
      result = await supabase
        .from('projects')
        .insert({ ...projectData, created_at: new Date().toISOString() })
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error saving project:', result.error)
      return { error: result.error }
    }

    // Refresh projects list
    await fetchProjects()
    return { data: result.data }
  }

  const deleteProject = async (projectId: string) => {
    if (!userId) return { error: 'User not authenticated' }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting project:', error)
      return { error }
    }

    // Refresh projects list
    await fetchProjects()
    return { error: null }
  }

  const getProject = async (projectId: string) => {
    if (!userId) return { error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return { error }
    }

    return { data, error: null }
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
