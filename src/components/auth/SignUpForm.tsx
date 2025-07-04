
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useSignUp } from '@/hooks/useSignUp'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

interface SignUpFormProps {
  onSuccess?: () => void
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)

  const { handleSignUp, loading } = useSignUp()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido'
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    const result = await handleSignUp(email, password)
    
    if (result.success) {
      setSuccess('Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.')
      // Limpar formulário
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`rounded-lg ${errors.email ? 'border-red-500' : ''}`}
          placeholder="seu@email.com"
        />
        {errors.email && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`rounded-lg pr-10 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Mínimo 6 caracteres"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-slate-500" />
            ) : (
              <Eye className="h-4 w-4 text-slate-500" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`rounded-lg pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
            placeholder="Digite a senha novamente"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-slate-500" />
            ) : (
              <Eye className="h-4 w-4 text-slate-500" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-700 hover:via-teal-600 hover:to-cyan-600 text-white font-medium rounded-lg"
      >
        {loading ? 'Cadastrando...' : 'Criar Conta'}
      </Button>

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-400">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}

export default SignUpForm
