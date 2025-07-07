
import { BaseProjectService } from '../base/BaseProjectService'
import { isValidUserId, isValidProjectId } from '@/lib/validation'
import { Project, ProjectOperationResult } from '@/types/project'

export class GetProjectService extends BaseProjectService {
  async execute(userId: string, projectId: string): Promise<ProjectOperationResult<Project>> {
    if (!isValidUserId(userId) || !isValidProjectId(projectId)) {
      return { error: 'IDs inválidos' }
    }

    try {
      console.log('Getting project with validation passed')
      
      const query = this.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single()

      const { data, error } = await query

      if (error) {
        return this.handleError(error, userId, 'get_project', 'Erro ao carregar projeto')
      }

       if (!data) {
         return { error: 'Projeto não encontrado' }
       }

       // Transform the data to match Project type
       const project = {
         ...data,
         elements: Array.isArray(data.elements) ? data.elements as any[] : []
       }

       console.log('Project fetched successfully')
       return { data: project }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'get_project', 'Erro inesperado ao carregar projeto')
    }
  }
}
