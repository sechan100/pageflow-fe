'use client'
import { STYLES } from "@/global/styles";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { ListItemButton, ListItemIcon, ListItemText, SxProps } from "@mui/material";
import { ChevronDown, ChevronRight, FilePen } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { indentPerDepth } from "../config";
import { TocFolder, TocSection } from "../model/toc.type";



type NodeButtonProps = {
  depth: number;
  icon: React.ReactNode;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
  onIconClick?: () => void;
  sx?: SxProps
}
const NodeButton = ({
  depth,
  icon,
  onClick,
  isSelected,
  onIconClick,
  text,
  sx
}: NodeButtonProps) => {

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
        backgroundColor: isSelected ? STYLES.color.primaryHsla({ a: 0.7 }) : undefined,
        ":hover": {
          color: "white",
          backgroundColor: isSelected ? STYLES.color.primaryHsla({ a: 0.8 }) : STYLES.color.primaryHsla({ a: 0.7 })
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
  const { params } = useNextRouter();
  const isEditing = useMemo(() => params?.folderId === folder.id, [params, folder.id]);

  return (
    <NodeButton
      isSelected={isEditing}
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
  const { params } = useNextRouter();
  const isEditing = useMemo(() => params?.sectionId === section.id, [params, section.id]);

  return (
    <NodeButton
      isSelected={isEditing}
      depth={depth}
      onClick={() => onClick?.(section)}
      icon={<FilePen size={20} />}
      text={section.title}
    />
  )
})