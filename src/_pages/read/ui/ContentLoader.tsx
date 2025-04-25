'use client'
import { SxProps } from "@mui/material";
import { useCallback, useEffect } from "react";
import { ReadableFolderContent, ReadableSectionContent } from "../model/readable-content";
import { useReadableUnit } from "../model/readable-unit";
import { pageChangedEvent, pageOverflowEvent, totalPagesChangedEvent } from "../model/reader-event";
import { FolderContent } from "./FolderContent";
import { SectionContent } from "./SectionContent";


type Props = {
  sx?: SxProps;
}
export const VirtualTocNodeLoader = ({
  sx
}: Props) => {
  // TODO: 이거 구현하기(현재 position의 가장 가까운 부모 folder 가져오기)
  const startingNode = "bceb5c28-b432-438c-afe7-f6afa8a1aeee";
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
    resolveReadableUnit(startingNode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fileNextSectionHandler = useCallback((pages: { current: number; total: number }) => {
    if (isUnitEnd) {
      return;
    }
    // 이제 다음 페이지가 끝 페이지인 경우 새로운 섹션을 로드한다.
    if (pages.current >= (pages.total - 1) - 1) {
      fillNextSection();
    }
  }, [isUnitEnd, fillNextSection]);

  /**
   * 'pageOverflowEvent'가 발생한 경우, 다음 페이지가 없는 상태에서 넘어간 것이므로 다음 leadNode를 로드한다.
   * 'pageChangedEvent', 'totalPagesChangedEvent'가 발생한 경우, 다음 페이지가 충분히 준비될 수 있도록 추가적으로 section을 로드한다.
   */
  useEffect(() => {
    const rmPageOverflowListener = pageOverflowEvent.registerListener(({ edge }) => {
      if (edge === "start") {
        moveLeadNode("prev");
      } else {
        moveLeadNode("next");
      }
    });

    const rmPageChangedListener = pageChangedEvent.registerListener(
      e => fileNextSectionHandler({
        current: e.currentPage,
        total: e.totalPageCount
      })
    );

    const rmTotalPagesChangedListener = totalPagesChangedEvent.registerListener(
      e => fileNextSectionHandler({
        current: e.currentPage,
        total: e.totalPageCount
      })
    );

    return () => {
      rmPageOverflowListener();
      rmPageChangedListener();
      rmTotalPagesChangedListener();
    }
  }, [fileNextSectionHandler, fillNextSection, isUnitEnd, moveLeadNode]);


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