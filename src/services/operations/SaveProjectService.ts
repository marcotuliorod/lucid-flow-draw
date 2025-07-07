
import { BaseProjectService } from '../base/BaseProjectService'
import { isValidUserId, isValidProjectId, validateAndSanitizeInput, projectSchema } from '@/lib/validation'
import { ProjectOperationResult, Project } from '@/types/project'

export class SaveProjectService extends BaseProjectService {
  async execute(
    userId: string, 
    name: string, 
    elements: any[], 
    projectId?: string
  ): Promise<ProjectOperationResult<Project>> {
    if (!isValidUserId(userId)) {
      return { error: 'ID de usuário inválido' }
    }

    if (projectId && !isValidProjectId(projectId)) {
      return { error: 'ID de projeto inválido' }
    }

    try {
      console.log('Saving project with validation...')
      
      const validation = validateAndSanitizeInput({ name, elements }, projectSchema)
      if (!validation.success) {
        return { error: validation.error }
      }

      const validatedData = validation.data
      const projectData = {
        user_id: userId,
        name: validatedData.name || 'Projeto sem nome',
        elements: validatedData.elements || [],
        updated_at: new Date().toISOString()
      }

      let result

      if (projectId) {
        const { data, error } = await this.supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .eq('user_id', userId)
          .select()
          .single()
        
        result = { data, error }
      } else {
        const { data, error } = await this.supabase
          .from('projects')
          .insert([projectData])
          .select()
          .single()
        
        result = { data, error }
      }

      if (result.error) {
        return this.handleError(result.error, userId, 'save_project', 'Erro ao salvar projeto')
      }

      console.log('Project saved successfully')
      return { data: result.data, error: null }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'save_project', 'Erro inesperado ao salvar projeto')
    }
  }
}
