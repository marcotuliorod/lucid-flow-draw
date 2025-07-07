
import { BaseProjectService } from '../base/BaseProjectService'
import { isValidUserId, isValidProjectId } from '@/lib/validation'
import { Project, ProjectOperationResult } from '@/types/project'

export class GetProjectService extends BaseProjectService {
  async execute(userId: string, projectId: string): Promise<ProjectOperationResult<Project>> {
    if (!isValidUserId(userId) || !isValidProjectId(projectId)) {
      return { error: 'IDs inválidos' }
    }

    try {
      console.log('GetProjectService: Getting project with validation passed for userId:', userId, 'projectId:', projectId)
      
      const query = this.supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single()

      console.log('GetProjectService: About to execute query')
      const { data, error } = await query
      console.log('GetProjectService: Query result - data:', data, 'error:', error)

      if (error) {
        console.error('GetProjectService: Supabase error:', error)
        return this.handleError(error, userId, 'get_project', 'Erro ao carregar projeto')
      }

       if (!data) {
         console.log('GetProjectService: No data returned from query')
         return { error: 'Projeto não encontrado' }
       }

       // Transform the data to match Project type
       const project = {
         ...data,
         elements: Array.isArray(data.elements) ? data.elements as any[] : []
       }

       console.log('GetProjectService: Project fetched successfully:', project)
       return { data: project }
    } catch (err) {
      console.error('GetProjectService: Unexpected error:', err)
      return this.handleUnexpectedError(err, userId, 'get_project', 'Erro inesperado ao carregar projeto')
    }
  }
}
