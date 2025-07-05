
import { useState } from 'react'
import { useAuth } from './useAuth'
import { useSecurity } from './useSecurity'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { emailSchema, sanitizeEmail, createSecureError } from '@/lib/validation'

export const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { checkAuthRateLimit } = useSecurity()
  const navigate = useNavigate()

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)

    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email)
      
      // Basic validation
      if (!sanitizedEmail || !password) {
        toast.error('Email e senha são obrigatórios')
        setLoading(false)
        return { success: false, error: 'Campos obrigatórios' }
      }

      // Validate email format
      const emailValidation = emailSchema.safeParse(sanitizedEmail)
      if (!emailValidation.success) {
        toast.error('Email inválido')
        setLoading(false)
        return { success: false, error: 'Email inválido' }
      }

      // Check rate limit
      if (!checkAuthRateLimit(sanitizedEmail, 'login')) {
        toast.error('Muitas tentativas de login. Tente novamente em 1 hora.')
        setLoading(false)
        return { success: false, error: 'Rate limit exceeded' }
      }

      console.log('useSignIn: Starting signin process')

      const { data, error } = await signIn(sanitizedEmail, password)
      
      if (error) {
        console.error('useSignIn: Error during signin:', error.message)
        
        // Secure error handling
        if (error.message?.includes('Invalid login credentials') || 
            error.message?.includes('Invalid email or password')) {
          toast.error('Email ou senha incorretos')
          return { success: false, error: 'Credenciais inválidas' }
        } else if (error.message?.includes('Email not confirmed')) {
          toast.error('Confirme seu email antes de fazer login')
          return { success: false, error: 'Email não confirmado' }
        } else if (error.message?.includes('not configured')) {
          toast.error('Sistema temporariamente indisponível. Tente novamente mais tarde.')
          return { success: false, error: 'Sistema não configurado' }
        } else {
          const userMessage = createSecureError('Erro ao fazer login. Tente novamente.', import.meta.env.DEV)
          toast.error(userMessage)
          return { success: false, error: 'Erro no login' }
        }
      }

      if (data?.user) {
        console.log('useSignIn: User signed in successfully')
        toast.success('Login realizado com sucesso!')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
        
        return { success: true, data }
      }

      return { success: false, error: 'Erro desconhecido' }
      
    } catch (err) {
      console.error('useSignIn: Unexpected error:', err)
      const userMessage = createSecureError('Erro inesperado. Tente novamente.', import.meta.env.DEV)
      toast.error(userMessage)
      return { success: false, error: 'Erro inesperado' }
    } finally {
      setLoading(false)
    }
  }

  return {
    handleSignIn,
    loading
  }
}
