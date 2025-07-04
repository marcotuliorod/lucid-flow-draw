
import { useState } from 'react'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useSignUp = () => {
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSignUp = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      console.log('useSignUp: Starting signup process for:', email)
      
      // Validação básica
      if (!email || !password) {
        toast.error('Email e senha são obrigatórios')
        setLoading(false)
        return { success: false, error: 'Campos obrigatórios não preenchidos' }
      }

      if (password.length < 6) {
        toast.error('A senha deve ter pelo menos 6 caracteres')
        setLoading(false)
        return { success: false, error: 'Senha muito curta' }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast.error('Email inválido')
        setLoading(false)
        return { success: false, error: 'Email inválido' }
      }

      const { data, error } = await signUp(email, password)
      
      if (error) {
        console.error('useSignUp: Error during signup:', error)
        
        // Tratamento de erros específicos do Supabase
        if (error.message?.includes('User already registered') || error.message?.includes('already been registered')) {
          toast.error('Este email já está cadastrado. Tente fazer login.')
          return { success: false, error: 'Email já cadastrado' }
        } else if (error.message?.includes('Invalid email')) {
          toast.error('Email inválido')
          return { success: false, error: 'Email inválido' }
        } else if (error.message?.includes('Password') || error.message?.includes('password')) {
          toast.error('Senha deve ter pelo menos 6 caracteres')
          return { success: false, error: 'Senha inválida' }
        } else if (error.message?.includes('not configured')) {
          toast.error('Sistema de autenticação não configurado. Entre em contato com o suporte.')
          return { success: false, error: 'Sistema não configurado' }
        } else {
          toast.error('Erro ao criar conta. Tente novamente.')
          return { success: false, error: error.message }
        }
      }

      if (data?.user) {
        console.log('useSignUp: User created successfully:', data.user.email)
        
        // Se o usuário foi criado e confirmado automaticamente
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

      // Caso padrão - cadastro realizado mas precisa confirmar email
      toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.')
      return { success: true, data }
      
    } catch (err) {
      console.error('useSignUp: Unexpected error:', err)
      toast.error('Erro inesperado. Tente novamente.')
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
