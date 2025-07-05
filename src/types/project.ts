
import { CanvasElement } from '@/components/editor/types'

export interface Project {
  id: string
  name: string
  elements: CanvasElement[]
  created_at: string
  updated_at: string
  user_id: string
}

export interface ProjectOperationResult<T = any> {
  data?: T
  error?: string | null
}
