import ForgotPasswordPage from '@/components/ForgotPasswordPage'
import AuthGuard from '@/components/AuthGuard'

export default function ForgotPassword() {
  return (
    <AuthGuard>
      <ForgotPasswordPage />
    </AuthGuard>
  )
}
