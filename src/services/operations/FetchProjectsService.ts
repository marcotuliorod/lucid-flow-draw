
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
      console.log('Fetching projects for user', userId)
      
      const query = this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      console.log('SQL Query will be executed for user_id:', userId)
      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        return this.handleError(error, userId, 'fetch_projects', 'Erro ao carregar projetos')
      }

      console.log('Raw data from Supabase:', data)
      console.log('Projects fetched successfully, count:', data?.length || 0)
      
      // Transform the data to match Project type
      const projects = data?.map(project => ({
        ...project,
        elements: Array.isArray(project.elements) ? project.elements as any[] : []
      })) || []
      
      return { data: projects }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'fetch_projects', 'Erro inesperado ao carregar projetos')
    }
  }
}
