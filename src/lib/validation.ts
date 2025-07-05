
import { z } from 'zod'

// Schema for project validation
export const projectSchema = z.object({
  name: z.string()
    .min(1, 'Nome do projeto é obrigatório')
    .max(100, 'Nome do projeto deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Nome do projeto contém caracteres inválidos'),
  elements: z.array(z.any()).max(1000, 'Projeto excede o limite de elementos')
})

// Schema for user input validation
export const emailSchema = z.string()
  .email('Email inválido')
  .max(254, 'Email muito longo')

export const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .max(128, 'Senha muito longa')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter ao menos uma letra minúscula, uma maiúscula e um número')

// Sanitization functions
export const sanitizeProjectName = (name: string): string => {
  return name.trim().replace(/[<>"/\\&']/g, '')
}

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

// Security utilities
export const isValidProjectId = (id: string): boolean => {
  return /^[a-zA-Z0-9\-_]{1,50}$/.test(id)
}

export const createSecureError = (message: string, isDevelopment: boolean = false) => {
  if (isDevelopment) {
    return message
  }
  return 'Ocorreu um erro. Tente novamente.'
}
