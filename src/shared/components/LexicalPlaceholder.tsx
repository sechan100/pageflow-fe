'use client'
import { Box, SxProps } from "@mui/material";



type Props = {
  text: string;
  sx?: SxProps;
}
export const LexicalPlaceholder = ({
  text,
  sx
}: Props) => {

  return (
    <Box sx={{
      color: 'hsla(0, 0.00%, 0.00%, 0.51)',
      overflow: 'hidden',
      position: 'absolute',
      textOverflow: 'ellipsis',
      top: 3,
      left: 2,
      userSelect: 'none',
      whiteSpace: 'nowrap',
      display: 'inline-block',
      pointerEvents: 'none',
      ...sx
    }}>
      {text}
    </Box>
  )
}