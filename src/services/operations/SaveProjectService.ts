
import { BaseProjectService } from '../base/BaseProjectService'
import { CanvasElement } from '@/components/editor/types'
import { Project, ProjectOperationResult } from '@/types/project'
import { 
  projectSchema, 
  sanitizeProjectName, 
  isValidProjectId, 
  isValidUserId,
  validateAndSanitizeInput 
} from '@/lib/validation'

export class SaveProjectService extends BaseProjectService {
  async execute(
    userId: string, 
    name: string, 
    elements: CanvasElement[], 
    projectId?: string
  ): Promise<ProjectOperationResult<Project>> {
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
        const query = this.supabase
          .from('projects')
          .update(projectData)
          .eq('id', projectId)
          .eq('user_id', userId)
          .select()
          .single()
        
        result = await query
      } else {
        const query = this.supabase
          .from('projects')
          .insert({ ...projectData, created_at: new Date().toISOString() })
          .select()
          .single()
        
        result = await query
      }

      if (result.error) {
        return this.handleError(result.error, userId, 'save_project', 'Erro ao salvar projeto')
      }

      console.log('Project saved successfully')
      return { data: result.data }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'save_project', 'Erro inesperado ao salvar projeto')
    }
  }
}
