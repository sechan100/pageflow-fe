'use client'
import { IconButton, SxProps, Tooltip } from "@mui/material"



type Props = {
  icon: React.ReactNode
  tooltip?: string
  onClick?: () => void
  sx?: SxProps
}
export const TooltipIconButton = ({
  icon,
  tooltip,
  onClick,
  sx
}: Props) => {

  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}