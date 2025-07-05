
import { BaseProjectService } from '../base/BaseProjectService'
import { isValidUserId } from '@/lib/validation'
import { Project, ProjectOperationResult } from '@/types/project'

export class FetchProjectsService extends BaseProjectService {
  async execute(userId: string): Promise<ProjectOperationResult<Project[]>> {
    if (!isValidUserId(userId)) {
      console.error('Invalid user ID format')
      return { error: 'ID do usuário inválido' }
    }

    try {
      console.log('Fetching projects for user')
      
      const query = this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        return this.handleError(error, userId, 'fetch_projects', 'Erro ao carregar projetos')
      }

      console.log('Projects fetched successfully')
      return { data: data || [] }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'fetch_projects', 'Erro inesperado ao carregar projetos')
    }
  }
}
