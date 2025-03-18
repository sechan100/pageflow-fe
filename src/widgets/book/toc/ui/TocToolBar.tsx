'use client'
import { Box, Button, Divider, SxProps } from "@mui/material"
import { Maximize2, Minimize2 } from "lucide-react"
import React from "react"
import { useTocStore } from "../model/use-toc"



type ToolIconProps = {
  icon: React.ReactNode;
  onClick: () => void;
}
const ToolIcon = ({
  icon,
  onClick,
}: ToolIconProps) => {

  return (
    <Button
      variant="text"
      startIcon={icon}
      onClick={onClick}
      sx={{
        p: 0,
        minWidth: 0,
        "& .MuiButton-startIcon": {
          margin: 0,
          padding: 0.2,
        }
      }}
    />
  )
}


type Props = {
  sx?: SxProps
}
export const TocToolBar = ({
  sx
}: Props) => {
  const expendAll = useTocStore(s => s.expendAllFolders);
  const collapseAll = useTocStore(s => s.collapseAllFolders);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'start',
          px: 1,
          gap: 1,
        }}
      >
        <ToolIcon
          icon={<Maximize2 />}
          onClick={expendAll}
        />
        <ToolIcon
          icon={<Minimize2 />}
          onClick={collapseAll}
        />
      </Box>
      <Divider />
    </>
  )
}