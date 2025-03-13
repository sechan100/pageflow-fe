/** @jsxImportSource @emotion/react */
'use client'

import { Button, ButtonProps } from "@mui/material"
import { useEffect, useState } from "react"
import { LoginModal } from "./LoginModal"
import { useNextRouter } from "@/shared/hooks/useNextRouter"



type Props = {
  className?: string
} & ButtonProps
export const LoginButton = ({
  className,
  ...props
}: Props) => {
  const { searchParams } = useNextRouter();
  const [open, setOpen] = useState<boolean>(false)

  // loginRequired 쿼리 파라미터가 true일 때 login 모달을 열어줌
  useEffect(() => {
    searchParams.get("loginRequired") === "true" && setOpen(true)
  }, [searchParams])

  return (
    <>
      <Button {...props} onClick={() => setOpen(s => !s)}>
        로그인
      </Button>
      <LoginModal open={open} handleClose={() => setOpen(false)} />
    </>
  )
}