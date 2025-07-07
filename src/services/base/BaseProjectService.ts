
import { supabase } from '@/integrations/supabase/client'
import { logSecurityEvent } from '@/lib/security'
import { createSecureError } from '@/lib/validation'
import { ProjectOperationResult } from '@/types/project'

export abstract class BaseProjectService {
  protected handleError(
    error: any,
    userId: string,
    action: string,
    userMessage: string
  ): ProjectOperationResult<any> {
    console.error(`Error in ${action}:`, error.message)
    logSecurityEvent({
      type: 'unusual_access',
      userId,
      timestamp: new Date(),
      details: { error: error.message, action }
    })
    const message = createSecureError(userMessage, import.meta.env.DEV)
    return { error: message }
  }

  protected handleUnexpectedError(
    error: any,
    userId: string,
    action: string,
    userMessage: string
  ): ProjectOperationResult<any> {
    console.error(`Unexpected error in ${action}:`, error)
    logSecurityEvent({
      type: 'unusual_access',
      userId,
      timestamp: new Date(),
      details: { error: String(error), action: `${action}_exception` }
    })
    const message = createSecureError(userMessage, import.meta.env.DEV)
    return { error: message }
  }

  protected get supabase() {
    return supabase
  }
}
