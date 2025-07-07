
import { BaseProjectService } from '../base/BaseProjectService'
import { isValidUserId, isValidProjectId, validateAndSanitizeInput } from '@/lib/validation'
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
      
      const validation = validateAndSanitizeInput(name, elements)
      if (!validation.success) {
        return { error: validation.error }
      }

      const projectData = {
        user_id: userId,
        name: validation.data.name || 'Projeto sem nome',
        elements: validation.data.elements || [],
        updated_at: new Date().toISOString()
      }

      let query = this.supabase.from('projects')

      if (projectId) {
        query = query.update(projectData).eq('id', projectId).eq('user_id', userId)
      } else {
        query = query.insert([projectData])
      }

      const { data, error } = await query.select().single()

      if (error) {
        return this.handleError(error, userId, 'save_project', 'Erro ao salvar projeto')
      }

      console.log('Project saved successfully')
      return { data, error: null }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'save_project', 'Erro inesperado ao salvar projeto')
    }
  }
}
