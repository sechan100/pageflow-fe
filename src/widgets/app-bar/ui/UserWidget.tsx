'use client'

import { Account } from "./Account";
import { useAuthentication } from "@/global/authentication/authentication"
import { useNextRouter } from "@/shared/hooks/useNextRouter"
import { Box, Button, ButtonProps } from "@mui/material"
import { useEffect, useState } from "react"
import { LoginModal } from "./LoginModal"


type LoginButtonProps = ButtonProps & {
  className?: string
}
const LoginButton = ({
  className,
  ...props
}: LoginButtonProps) => {
  const { searchParams } = useNextRouter();
  const [open, setOpen] = useState<boolean>(false)

  // loginRequired 쿼리 파라미터가 true일 때 login 모달을 열어줌
  useEffect(() => {
    if (searchParams?.get("login") === "true") {
      setOpen(true)
    }
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


type Props = {
  className?: string
}
export const UserWidget = ({
  className
}: Props) => {
  const { isAuthenticated } = useAuthentication();

  return (
    <Box>
      {isAuthenticated
        ? <Account />
        : <LoginButton variant="contained" />
      }
    </Box>
  )
}