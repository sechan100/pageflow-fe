import { AuthGuard } from "../_utils/AuthGuard"






type Props = {
  children: React.ReactNode
}
export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}