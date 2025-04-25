'use client'
import { SxProps } from "@mui/material";
import { useCallback, useEffect } from "react";
import { ReadableFolderContent, ReadableSectionContent } from "../model/readable-content";
import { useReadableUnit } from "../model/readable-unit";
import { pageChangedEvent, pageOverflowEvent, readableUnitChangedEvent } from "../model/reader-event";
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

  /**
   * 최초 렌더링시에 LeadFolder를 초기화한다.
   */
  useEffect(() => {
    resolveReadableUnit(startingNode);
    readableUnitChangedEvent.emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * leadNode가 변경될 때마다, 추가적인 섹션을 로드한다.
   * 딱 한번만 fillNextSection()을 호출하면 연쇄적으로
   * fillNextSection 새로운 섹션이 로드됨.(가능하다면) => totalPageCount가 변함 => 아래쪽에 등록한 이벤트가 호출되어서 page가 모자라다면 더 채움.
   */
  useEffect(() => {
    if (isUnitEnd) {
      return;
    }
    fillNextSection();
  }, [fillNextSection, isUnitEnd, leadNode]);

  const resolveNextSection = useCallback((pages: { current: number; total: number }) => {
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
      console.log(`page ${edge === "start" ? "이전" : "다음"}으로 오버플로우`);

      let movedSuccess = false;
      if (edge === "start") {
        movedSuccess = moveLeadNode("prev");
      } else {
        movedSuccess = moveLeadNode("next");
      }

      if (movedSuccess) {
        readableUnitChangedEvent.emit();
      }
    });

    const rmPageChangedListener = pageChangedEvent.registerListener(e => {
      resolveNextSection({
        current: e.currentPage,
        total: e.totalPageCount
      })
    });

    return () => {
      rmPageOverflowListener();
      rmPageChangedListener();
    }
  }, [resolveNextSection, fillNextSection, isUnitEnd, moveLeadNode]);


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