
import { z } from 'zod'

// Schema for canvas element validation
export const canvasElementSchema = z.object({
  id: z.string().uuid('ID do elemento deve ser um UUID válido'),
  type: z.enum(['rectangle', 'circle', 'text', 'arrow'], {
    errorMap: () => ({ message: 'Tipo de elemento inválido' })
  }),
  x: z.number().min(0).max(10000, 'Posição X inválida'),
  y: z.number().min(0).max(10000, 'Posição Y inválida'),
  width: z.number().min(1).max(5000, 'Largura inválida').optional(),
  height: z.number().min(1).max(5000, 'Altura inválida').optional(),
  text: z.string().max(1000, 'Texto muito longo').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida').optional(),
  fontSize: z.number().min(8).max(72, 'Tamanho da fonte inválido').optional(),
  strokeWidth: z.number().min(1).max(20, 'Espessura da linha inválida').optional()
}).strict()

// Enhanced project validation with stricter element validation
export const projectSchema = z.object({
  name: z.string()
    .min(1, 'Nome do projeto é obrigatório')
    .max(100, 'Nome do projeto deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9\s\-_\u00C0-\u017F]+$/, 'Nome do projeto contém caracteres inválidos'),
  elements: z.array(canvasElementSchema)
    .max(500, 'Projeto excede o limite de 500 elementos')
    .default([])
})

// Enhanced user input validation
export const emailSchema = z.string()
  .email('Email inválido')
  .max(254, 'Email muito longo')
  .transform(email => email.toLowerCase().trim())

export const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos uma letra minúscula, uma maiúscula e um número')

// User ID validation
export const userIdSchema = z.string()
  .uuid('ID do usuário deve ser um UUID válido')

// Sanitization functions with enhanced security
export const sanitizeProjectName = (name: string): string => {
  return name.trim().replace(/[<>"/\\&'`]/g, '').substring(0, 100)
}

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase().replace(/[<>"/\\&'`]/g, '')
}

export const sanitizeText = (text: string, maxLength: number = 1000): string => {
  return text.trim().replace(/[<>"/\\&'`]/g, '').substring(0, maxLength)
}

// Enhanced HTML sanitization for user content
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

// URL validation for image sources
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    // Only allow HTTPS URLs and data URLs for images
    return urlObj.protocol === 'https:' || url.startsWith('data:image/')
  } catch {
    return false
  }
}

// Security utilities with enhanced validation
export const isValidProjectId = (id: string): boolean => {
  return /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)
}

export const isValidUserId = (id: string): boolean => {
  return /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id)
}

// Enhanced secure error handling
export const createSecureError = (message: string, isDevelopment: boolean = false, details?: string) => {
  if (isDevelopment && details) {
    console.error(`Security Error: ${message}`, details)
  }
  
  if (isDevelopment) {
    return message
  }
  return 'Ocorreu um erro. Tente novamente.'
}

// Rate limiting helpers (for future implementation)
export const createRateLimitKey = (userId: string, action: string): string => {
  return `rate_limit:${userId}:${action}`
}

// Input validation helper
export const validateAndSanitizeInput = <T>(
  data: unknown, 
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: 'Dados inválidos' }
  }
}
