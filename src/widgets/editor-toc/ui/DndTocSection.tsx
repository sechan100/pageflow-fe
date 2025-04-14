'use client'
import { EditorTocSection } from "@/entities/editor";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { SxProps } from "@mui/material";
import { FilePen } from "lucide-react";
import { memo, useMemo } from "react";
import { useBookContext } from "../model/book-context";
import { Dndable } from "./Dndable";
import { StyledBaseTocNode } from "./StyledBaseTocNode";


const sectionEditPageLink = (bookId: string, sectionId: string) => `/write/${bookId}/sections/${sectionId}`;

type StyledSectionNodeProps = {
  section: EditorTocSection;
  depth: number;
  onClick?: (section: EditorTocSection) => void;
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
    <StyledBaseTocNode
      isActive={isEditing}
      depth={depth}
      onClick={() => onClick?.(section)}
      icon={<FilePen size={20} />}
      text={section.title}
    />
  )
})

type Props = {
  section: EditorTocSection;
  depth: number;
  sx?: SxProps
}
export const DndTocSection = memo(function DroppableSection({
  section,
  depth,
  sx
}: Props) {
  const { id: bookId } = useBookContext();
  const { router } = useNextRouter();

  return (
    <Dndable
      node={section}
      depth={depth}
    >
      <StyledSectionNode
        section={section}
        depth={depth}
        onClick={() => router.push(sectionEditPageLink(bookId, section.id))}
      />
    </Dndable>
  );
})