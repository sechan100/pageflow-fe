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
      router.replace('/?login=true&returnUrl=' + pathname)
    }
    // isAuthenticated를 의존성 배열에서 제외, isAuthenticatedLoading만 의존, loading값이 변경되어 최초 로딩이 완료될 때만 실행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticatedLoading, pathname, router])


  // 로딩중이거나 인증되지 않았을 때는 아무것도 렌더링하지 않음
  if (isAuthenticatedLoading) return <></>
  if (!isAuthenticated) return <></>

  return (
    <>
      {children}
    </>
  )
}