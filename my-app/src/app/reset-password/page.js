import ResetPasswordPage from '@/components/ResetPasswordPage'
import AuthGuard from '@/components/AuthGuard'

export default function ResetPassword() {
  return (
    <AuthGuard>
      <ResetPasswordPage />
    </AuthGuard>
  )
}
