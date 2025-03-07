/** @jsxImportSource @emotion/react */
'use client'

import { Button } from "@mui/material"
import { useState } from "react"
import { LoginModal } from "./LoginModal"



type Props = {
  className?: string
}
export const LoginButton = ({
  className
}: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  
  return (
    <>
      <Button variant="contained" size="small" onClick={() => setOpen(s=>!s)}>
        로그인
      </Button>
      <LoginModal open={open} handleClose={() => setOpen(false)} />
    </>
  )
}