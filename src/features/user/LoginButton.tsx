/** @jsxImportSource @emotion/react */
'use client'

import { Button } from "@mui/material"
import { useCallback, useState } from "react"
import { LoginModal } from "./LoginModal"



type Props = {
  
}
export const LoginButton = ({
  
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