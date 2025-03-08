/** @jsxImportSource @emotion/react */
'use client'

import { Button, ButtonProps } from "@mui/material"
import { useState } from "react"
import { LoginModal } from "./LoginModal"



type Props = {
  className?: string
} & ButtonProps
export const LoginButton = ({
  className,
  ...props
}: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  
  return (
    <>
      <Button {...props} onClick={() => setOpen(s=>!s)}>
        로그인
      </Button>
      <LoginModal open={open} handleClose={() => setOpen(false)} />
    </>
  )
}