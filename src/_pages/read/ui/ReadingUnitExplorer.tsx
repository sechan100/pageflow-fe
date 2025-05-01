'use client'
import { SxProps } from "@mui/material";
import { useEffect } from "react";
import { isReadableSectionContent, ReadableFolderContent, ReadableSectionContent } from "../../model/readable-content";
import { useReadingUnitExplorer, useReadingUnitStore } from "../../stores/reading-unit-store";
import { FolderContent } from "../FolderContent";
import { SectionContent } from "../SectionContent";


type Props = {
  sx?: SxProps;
}
export const ReadingUnitExplorer = ({
  sx
}: Props) => {
  const startingNodeId = "bceb5c28-b432-438c-afe7-f6afa8a1aeee";
  const { readingUnitContent } = useReadingUnitStore();
  const { init } = useReadingUnitExplorer();

  /**
   * 최초 렌더링시에 시작 unit 초기화
   */
  useEffect(() => {
    init(startingNodeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (readingUnitContent === null) {
    return <div>Loading...</div>
  }
  return (
    <>
      {readingUnitContent.contents.map((content) => {
        if (isReadableSectionContent(content)) {
          return <SectionContent key={content.id} section={content as ReadableSectionContent} />
        } else {
          return <FolderContent key={content.id} folder={content as ReadableFolderContent} />
        }
      })}
    </>
  )
}