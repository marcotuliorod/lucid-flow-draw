
import { BaseProjectService } from '../base/BaseProjectService'
import { isValidUserId, isValidProjectId } from '@/lib/validation'
import { ProjectOperationResult } from '@/types/project'

export class DeleteProjectService extends BaseProjectService {
  async execute(userId: string, projectId: string): Promise<ProjectOperationResult<null>> {
    if (!isValidUserId(userId) || !isValidProjectId(projectId)) {
      return { error: 'IDs inválidos' }
    }

    try {
      console.log('Deleting project with validation passed')
      
      const query = this.supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId)

      const { error } = await query

      if (error) {
        return this.handleError(error, userId, 'delete_project', 'Erro ao deletar projeto')
      }

      console.log('Project deleted successfully')
      return { error: null }
    } catch (err) {
      return this.handleUnexpectedError(err, userId, 'delete_project', 'Erro inesperado ao deletar projeto')
    }
  }
}
