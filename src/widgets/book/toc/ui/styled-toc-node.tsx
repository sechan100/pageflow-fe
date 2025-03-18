'use client'
import { STYLES } from "@/global/styles";
import { ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { ChevronDown, ChevronRight, FilePen } from "lucide-react";
import { memo } from "react";
import { indentPerDepth } from "../config";
import { TocFolder, TocSection } from "../model/toc.type";



type NodeButtonProps = {
  depth: number;
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  onIconClick?: () => void;
  sx?: SxProps
}
const NodeButton = ({
  depth,
  icon,
  onClick,
  onIconClick,
  text,
  sx
}: NodeButtonProps) => {

  return (
    <ListItemButton
      dense
      onClick={onClick}
      sx={{
        pl: 1 + depth * indentPerDepth,
        position: 'relative',
      }}
    >
      <ListItemIcon
        onClick={onIconClick}
        sx={{
          minWidth: 0,
          mr: 1,
          borderRadius: '50%',
          "&": (onIconClick && {
            transition: 'background-color 0.2s',
            ":hover": {
              cursor: 'pointer',
              backgroundColor: STYLES.color.backgroundHsla({ l: -20 })
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
    </ListItemButton >
  )
}


type StyledFolderNodeProps = {
  folder: TocFolder;
  depth: number;
  isOpen: boolean;
  onIconClick?: (folder: TocFolder) => void;
  onClick?: (folder: TocFolder) => void;
  sx?: SxProps
}
export const StyledFolderNode = memo(function Folder({
  folder,
  depth,
  isOpen,
  onIconClick,
  onClick,
  sx
}: StyledFolderNodeProps) {

  return (
    <NodeButton
      depth={depth}
      onClick={() => onClick?.(folder)}
      onIconClick={() => onIconClick?.(folder)}
      icon={isOpen ? <ChevronDown /> : <ChevronRight />}
      text={folder.title}
    />
  )
})

type StyledSectionNodeProps = {
  section: TocSection;
  depth: number;
  onClick?: (section: TocSection) => void;
  sx?: SxProps
}
export const StyledSectionNode = memo(function Section({
  section,
  depth,
  onClick,
  sx
}: StyledSectionNodeProps) {

  return (
    <NodeButton
      depth={depth}
      onClick={() => onClick?.(section)}
      icon={<FilePen size={20} />}
      text={section.title}
    />
  )
})