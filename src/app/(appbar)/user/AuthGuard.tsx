'use client'

import { useAuthentication } from "@/global/authentication/authentication"
import { useNextRouter } from "@/shared/hooks/useNextRouter"
import { useEffect } from "react"



type Props = {
  className?: string
  children: React.ReactNode
}
export const AuthGuard = ({
  children,
  className
}: Props) => {
  const { router, pathname } = useNextRouter()
  const { isAuthenticated, isAuthenticatedLoading } = useAuthentication();

  useEffect(() => {
    if (!isAuthenticatedLoading && !isAuthenticated) {
      router.replace('/?loginRequired=true&returnUrl=' + pathname)
    }
  }, [isAuthenticatedLoading])


  // 로딩중이거나 인증되지 않았을 때는 아무것도 렌더링하지 않음
  if (isAuthenticatedLoading) return <></>
  if (!isAuthenticated) return <></>

  return (
    <>
      {children}
    </>
  )
}