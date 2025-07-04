
import { useState } from 'react'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export const useSignUp = () => {
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

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
        
        // Tratamento de erros específicos
        if (error.message?.includes('User already registered')) {
          toast.error('Este email já está cadastrado. Tente fazer login.')
          return { success: false, error: 'Email já cadastrado' }
        } else if (error.message?.includes('Invalid email')) {
          toast.error('Email inválido')
          return { success: false, error: 'Email inválido' }
        } else if (error.message?.includes('Password')) {
          toast.error('Senha deve ter pelo menos 6 caracteres')
          return { success: false, error: 'Senha inválida' }
        } else {
          toast.error('Erro ao criar conta. Tente novamente.')
          return { success: false, error: error.message }
        }
      }

      if (data?.user) {
        console.log('useSignUp: User created successfully:', data.user.email)
        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.')
        return { success: true, data }
      }

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
