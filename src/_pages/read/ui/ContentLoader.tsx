'use client'
import { SxProps } from "@mui/material";
import { useEffect } from "react";
import { ReadableFolderContent, ReadableSectionContent } from "../model/readable-content";
import { pageChangedEvent, totalPagesChangedEvent } from "../model/reader-event";
import { useReadableUnit } from "../model/use-readable-unit";
import { FolderContent } from "./FolderContent";
import { SectionContent } from "./SectionContent";


type Props = {
  sx?: SxProps;
}
export const VirtualTocNodeLoader = ({
  sx
}: Props) => {
  // TODO: 이거 구현하기(현재 position의 가장 가까운 부모 folder 가져오기)
  const startingFolderId = "70020faa-f35d-4722-8d46-4203274b151b";
  const {
    leadNode,
    leadNodeContent,
    sections,
    isUnitEnd,
    fillNextSection,
    moveLeadNode,
    resolveReadableUnit
  } = useReadableUnit();
  console.log("leadFolder", leadNode, "sections", sections);

  /**
   * 최초 렌더링시에 LeadFolder를 초기화한다.
   */
  useEffect(() => {
    resolveReadableUnit(startingFolderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 'pageChangedEvent', 'totalPagesChangedEvent'가 발생한 경우, 다음 페이지가 충분히 준비될 수 있도록 추가적으로 section을 로드한다.
   */
  useEffect(() => {
    type Pages = {
      current: number;
      total: number;
    }
    const fetchNextSectionHandler = (pages: Pages) => {
      // 이제 다음 페이지가 끝 페이지인 경우 새로운 섹션을 로드한다.
      if (pages.current >= (pages.total - 1) - 1) {
        fillNextSection();
      }
    }
    const rmPageChangedListener = pageChangedEvent.registerListener(
      e => fetchNextSectionHandler({
        current: e.currentPage,
        total: e.totalPageCount
      })
    );
    const rmTotalPagesChangedListener = totalPagesChangedEvent.registerListener(
      e => fetchNextSectionHandler({
        current: e.currentPage,
        total: e.totalPageCount
      })
    );
    return () => {
      rmPageChangedListener();
      rmTotalPagesChangedListener();
    }
  }, [fillNextSection]);


  return (
    <>
      {leadNode.type === "FOLDER"
        ? <FolderContent folder={leadNodeContent as ReadableFolderContent} />
        : <SectionContent section={leadNodeContent as ReadableSectionContent} />
      }
      {sections.map((content) => (
        <SectionContent key={content.id} section={content} />
      ))}
    </>
  )
}