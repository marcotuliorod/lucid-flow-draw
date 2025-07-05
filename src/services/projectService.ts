
import { supabase } from '@/lib/supabase'
import { CanvasElement } from '@/components/editor/types'
import { 
  projectSchema, 
  sanitizeProjectName, 
  isValidProjectId, 
  isValidUserId,
  createSecureError,
  validateAndSanitizeInput 
} from '@/lib/validation'
import { logSecurityEvent } from '@/lib/security'
import { Project, ProjectOperationResult } from '@/types/project'

export const projectService = {
  async fetchProjects(userId: string): Promise<ProjectOperationResult<Project[]>> {
    if (!isValidUserId(userId)) {
      console.error('Invalid user ID format')
      return { error: 'ID do usuário inválido' }
    }

    try {
      console.log('Fetching projects for user')
      
      const query = supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Error fetching projects:', error.message)
        logSecurityEvent({
          type: 'unusual_access',
          userId,
          timestamp: new Date(),
          details: { error: error.message, action: 'fetch_projects' }
        })
        const userMessage = createSecureError('Erro ao carregar projetos', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Projects fetched successfully')
      return { data: data || [] }
    } catch (err) {
      console.error('Unexpected error fetching projects:', err)
      logSecurityEvent({
        type: 'unusual_access',
        userId,
        timestamp: new Date(),
        details: { error: String(err), action: 'fetch_projects_exception' }
      })
      return { error: createSecureError('Erro inesperado ao carregar projetos', import.meta.env.DEV) }
    }
  },

  async saveProject(userId: string, name: string, elements: CanvasElement[], projectId?: string): Promise<ProjectOperationResult<Project>> {
    if (!isValidUserId(userId)) {
      return { error: 'ID do usuário inválido' }
    }

    try {
      const sanitizedName = sanitizeProjectName(name)
      
      const validation = validateAndSanitizeInput({
        name: sanitizedName,
        elements
      }, projectSchema)

      if (!validation.success) {
        return { error: validation.error }
      }

      if (projectId && !isValidProjectId(projectId)) {
        return { error: 'ID do projeto inválido' }
      }

      console.log('Saving project with validation passed')
      
      const projectData = {
        name: validation.data.name,
        elements: validation.data.elements,
        user_id: userId,
        updated_at: new Date().toISOString()
      }

      let result
      if (projectId) {
        const query = supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .eq('user_id', userId)
          .select()
          .single()
        
        result = await query
      } else {
        const query = supabase
          .from('projects')
          .insert({ ...projectData, created_at: new Date().toISOString() })
          .select()
          .single()
        
        result = await query
      }

      if (result.error) {
        console.error('Error saving project:', result.error.message)
        logSecurityEvent({
          type: 'unusual_access',
          userId,
          timestamp: new Date(),
          details: { error: result.error.message, action: 'save_project' }
        })
        const userMessage = createSecureError('Erro ao salvar projeto', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Project saved successfully')
      return { data: result.data }
    } catch (err) {
      console.error('Unexpected error saving project:', err)
      logSecurityEvent({
        type: 'unusual_access',
        userId,
        timestamp: new Date(),
        details: { error: String(err), action: 'save_project_exception' }
      })
      const userMessage = createSecureError('Erro inesperado ao salvar projeto', import.meta.env.DEV)
      return { error: userMessage }
    }
  },

  async deleteProject(userId: string, projectId: string): Promise<ProjectOperationResult<null>> {
    if (!isValidUserId(userId) || !isValidProjectId(projectId)) {
      return { error: 'IDs inválidos' }
    }

    try {
      console.log('Deleting project with validation passed')
      
      const query = supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId)

      const { error } = await query

      if (error) {
        console.error('Error deleting project:', error.message)
        logSecurityEvent({
          type: 'unusual_access',
          userId,
          timestamp: new Date(),
          details: { error: error.message, action: 'delete_project' }
        })
        const userMessage = createSecureError('Erro ao deletar projeto', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Project deleted successfully')
      return { error: null }
    } catch (err) {
      console.error('Unexpected error deleting project:', err)
      logSecurityEvent({
        type: 'unusual_access',
        userId,
        timestamp: new Date(),
        details: { error: String(err), action: 'delete_project_exception' }
      })
      const userMessage = createSecureError('Erro inesperado ao deletar projeto', import.meta.env.DEV)
      return { error: userMessage }
    }
  },

  async getProject(userId: string, projectId: string): Promise<ProjectOperationResult<Project>> {
    if (!isValidUserId(userId) || !isValidProjectId(projectId)) {
      return { error: 'IDs inválidos' }
    }

    try {
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
        logSecurityEvent({
          type: 'unusual_access',
          userId,
          timestamp: new Date(),
          details: { error: error.message, action: 'get_project' }
        })
        const userMessage = createSecureError('Erro ao carregar projeto', import.meta.env.DEV)
        return { error: userMessage }
      }

      console.log('Project fetched successfully')
      return { data, error: null }
    } catch (err) {
      console.error('Unexpected error fetching project:', err)
      logSecurityEvent({
        type: 'unusual_access',
        userId,
        timestamp: new Date(),
        details: { error: String(err), action: 'get_project_exception' }
      })
      const userMessage = createSecureError('Erro inesperado ao carregar projeto', import.meta.env.DEV)
      return { error: userMessage }
    }
  }
}
