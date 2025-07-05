
import { CanvasElement } from '@/components/editor/types'
import { Project, ProjectOperationResult } from '@/types/project'
import { FetchProjectsService } from './operations/FetchProjectsService'
import { SaveProjectService } from './operations/SaveProjectService'
import { DeleteProjectService } from './operations/DeleteProjectService'
import { GetProjectService } from './operations/GetProjectService'

class ProjectService {
  private fetchProjectsService = new FetchProjectsService()
  private saveProjectService = new SaveProjectService()
  private deleteProjectService = new DeleteProjectService()
  private getProjectService = new GetProjectService()

  async fetchProjects(userId: string): Promise<ProjectOperationResult<Project[]>> {
    return this.fetchProjectsService.execute(userId)
  }

  async saveProject(
    userId: string, 
    name: string, 
    elements: CanvasElement[], 
    projectId?: string
  ): Promise<ProjectOperationResult<Project>> {
    return this.saveProjectService.execute(userId, name, elements, projectId)
  }

  async deleteProject(userId: string, projectId: string): Promise<ProjectOperationResult<null>> {
    return this.deleteProjectService.execute(userId, projectId)
  }

  async getProject(userId: string, projectId: string): Promise<ProjectOperationResult<Project>> {
    return this.getProjectService.execute(userId, projectId)
  }
}

export const projectService = new ProjectService()
