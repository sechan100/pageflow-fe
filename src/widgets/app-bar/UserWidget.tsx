'use client'

import { AccountFeature, LoginButton } from "@/features/user"
import { useAuthentication } from "@/global/authentication/authentication"
import { Box } from "@mui/material"



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
        ? <AccountFeature />
        : <LoginButton variant="contained" />
      }
    </Box>
  )
}