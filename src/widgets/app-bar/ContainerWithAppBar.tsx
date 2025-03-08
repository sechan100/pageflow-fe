'use client'

import { Container } from "@mui/material"



type Props = {
  className?: string
  children?: React.ReactNode
}
export const ContainerWithAppBar = ({
  className,
  children,
}: Props) => {
  
  return (
    <>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 8, gap: 4 }}
      >
        {children}
      </Container>
    </>
  )
}