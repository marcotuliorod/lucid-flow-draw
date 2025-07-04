
import { useState } from 'react'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSignIn = async (email: string, password: string) => {
    setLoading(true)

    try {
      console.log('useSignIn: Starting signin process for:', email)

      if (!email || !password) {
        toast.error('Email e senha são obrigatórios')
        setLoading(false)
        return { success: false, error: 'Campos obrigatórios' }
      }

      const { data, error } = await signIn(email, password)
      
      if (error) {
        console.error('useSignIn: Error during signin:', error)
        
        if (error.message?.includes('Invalid login credentials') || 
            error.message?.includes('Invalid email or password')) {
          toast.error('Email ou senha incorretos')
          return { success: false, error: 'Credenciais inválidas' }
        } else if (error.message?.includes('Email not confirmed')) {
          toast.error('Confirme seu email antes de fazer login')
          return { success: false, error: 'Email não confirmado' }
        } else if (error.message?.includes('not configured')) {
          toast.error('Sistema de autenticação não configurado')
          return { success: false, error: 'Sistema não configurado' }
        } else {
          toast.error('Erro ao fazer login. Tente novamente.')
          return { success: false, error: error.message }
        }
      }

      if (data?.user) {
        console.log('useSignIn: User signed in successfully:', data.user.email)
        toast.success('Login realizado com sucesso!')
        
        // Pequeno delay para mostrar o toast antes de redirecionar
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
        
        return { success: true, data }
      }

      return { success: false, error: 'Erro desconhecido' }
      
    } catch (err) {
      console.error('useSignIn: Unexpected error:', err)
      toast.error('Erro inesperado. Tente novamente.')
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
