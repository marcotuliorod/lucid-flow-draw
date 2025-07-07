
import { useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/integrations/supabase/client'
import { useSecurity } from './useSecurity'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { emailSchema, passwordSchema, sanitizeEmail, createSecureError } from '@/lib/validation'

export const useSignUp = () => {
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { checkAuthRateLimit } = useSecurity()
  const navigate = useNavigate()

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      // Sanitize inputs
      const sanitizedEmail = sanitizeEmail(email)
      
      // Validate inputs
      const emailValidation = emailSchema.safeParse(sanitizedEmail)
      const passwordValidation = passwordSchema.safeParse(password)
      
      if (!emailValidation.success) {
        toast.error(emailValidation.error.errors[0].message)
        setLoading(false)
        return { success: false, error: 'Email inválido' }
      }
      
      if (!passwordValidation.success) {
        toast.error(passwordValidation.error.errors[0].message)
        setLoading(false)
        return { success: false, error: 'Senha inválida' }
      }

      // Check rate limit
      if (!checkAuthRateLimit(sanitizedEmail, 'signup')) {
        toast.error('Muitas tentativas de cadastro. Tente novamente em 1 hora.')
        setLoading(false)
        return { success: false, error: 'Rate limit exceeded' }
      }

      console.log('useSignUp: Starting signup process')

      const { data, error } = await signUp(sanitizedEmail, password)
      
      if (error) {
        console.error('useSignUp: Error during signup:', error.message)
        
        // Secure error handling - don't expose system details
        const userMessage = createSecureError('Erro ao criar conta. Tente novamente.', import.meta.env.DEV)
        
        if (error.message?.includes('User already registered') || error.message?.includes('already been registered')) {
          toast.error('Este email já está cadastrado. Tente fazer login.')
          return { success: false, error: 'Email já cadastrado' }
        } else if (error.message?.includes('not configured')) {
          toast.error('Sistema temporariamente indisponível. Tente novamente mais tarde.')
          return { success: false, error: 'Sistema não configurado' }
        } else {
          toast.error(userMessage)
          return { success: false, error: 'Erro na criação da conta' }
        }
      }

      if (data?.user) {
        console.log('useSignUp: User created successfully')
        
        if (data.user.email_confirmed_at || data.session) {
          toast.success('Conta criada com sucesso! Redirecionando...')
          setTimeout(() => {
            navigate('/dashboard')
          }, 1500)
        } else {
          toast.success('Conta criada! Verifique seu email para confirmar antes de fazer login.')
        }
        
        return { success: true, data }
      }

      toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.')
      return { success: true, data }
      
    } catch (err) {
      console.error('useSignUp: Unexpected error:', err)
      const userMessage = createSecureError('Erro inesperado. Tente novamente.', import.meta.env.DEV)
      toast.error(userMessage)
      return { success: false, error: 'Erro inesperado' }
    } finally {
      setLoading(false)
    }
  }

  return {
    handleSignUp,
    loading
  }
}
