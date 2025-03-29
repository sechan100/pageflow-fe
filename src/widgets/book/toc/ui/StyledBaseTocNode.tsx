'use client'
import { STYLES } from "@/global/styles";
import { ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { useCallback } from "react";
import { indentPerDepth } from "../config";



export type StyledBaseTocNodeProps = {
  depth: number;
  icon: React.ReactNode;
  text: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  onIconClick?: () => void;
  sx?: SxProps
}
export const StyledBaseTocNode = ({
  depth,
  icon,
  onClick,
  isActive,
  onIconClick,
  text,
  sx
}: StyledBaseTocNodeProps) => {

  const handleIconClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onIconClick?.();
  }, [onIconClick])

  return (
    <ListItemButton
      dense
      onClick={onClick}
      sx={{
        pl: 1 + depth * indentPerDepth,
        position: 'relative',
        backgroundColor: isActive ? STYLES.color.primaryHsla({ a: 0.7 }) : undefined,
        ":hover": {
          color: "white",
          backgroundColor: isActive ? STYLES.color.primaryHsla({ a: 0.8 }) : STYLES.color.primaryHsla({ a: 0.7 })
        },
      }}
    >
      <ListItemIcon
        onClick={handleIconClick}
        sx={{
          minWidth: 0,
          mr: 1,
          borderRadius: '50%',
          "&": (onIconClick && {
            transition: 'background-color 0.2s',
            ":hover": {
              cursor: 'pointer',
              backgroundColor: STYLES.color.primaryHsla({ l: -10 })
            }
          })
        }}
      >
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={text}
        slotProps={{
          primary: {
            noWrap: true,
          }
        }}
      />
    </ListItemButton>
  )
}



