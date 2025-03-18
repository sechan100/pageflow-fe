'use client'
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { SxProps } from "@mui/material";
import { memo } from "react";
import { TocSection } from "../model/toc.type";
import { useTocStore } from "../model/use-toc";
import { Dndable } from "./Dndable";
import { StyledSectionNode } from "./styled-toc-node";


const sectionEditPageLink = (bookId: string, sectionId: string) => `/write/${bookId}/sections/${sectionId}`;


type Props = {
  section: TocSection;
  depth: number;
  sx?: SxProps
}
export const DndTocSection = memo(function DroppableSection({
  section,
  depth,
  sx
}: Props) {
  const { bookId } = useTocStore(s => s.toc);
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