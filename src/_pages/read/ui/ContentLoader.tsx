'use client'
import { ReadableTocNode } from "@/entities/book";
import { SxProps } from "@mui/material";
import { useCallback, useEffect } from "react";
import { ReadableFolderContent, ReadableSectionContent } from "../model/readable-content";
import { resolveLeadNode, useReadableUnit } from "../model/readable-unit";
import { PageChangedEvent, PageOverflowEvent, readerEvent } from "../model/reader-event";
import { useTocContext } from "../model/toc-context";
import { FolderContent } from "./FolderContent";
import { SectionContent } from "./SectionContent";
import { useContainerStore } from "./logic/use-container-store";


type Props = {
  sx?: SxProps;
}
export const ContentLoader = ({
  sx
}: Props) => {
  // TODO: 이거 구현하기(현재 position의 가장 가까운 부모 folder 가져오기)
  const startingNode = "bceb5c28-b432-438c-afe7-f6afa8a1aeee";
  const changeLeadNode = useContainerStore(s => s.changeLeadNode);
  const toc = useTocContext();
  const {
    leadNode,
    leadNodeContent,
    sections,
    isUnitEnd,
    fillNextSection,
    moveLeadNode,
    setLeadNode
  } = useReadableUnit();

  /**
   * 최초 렌더링시에 LeadFolder를 초기화한다.
   */
  useEffect(() => {
    const newLeadNode = resolveLeadNode(toc, startingNode);
    setLeadNode(newLeadNode);
    changeLeadNode({ id: newLeadNode.id, readFrom: "start" });
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
   * pageOverflowEvent가 발생한 경우, 다음 페이지가 없는 상태에서 넘어간 것이므로 다음 leadNode를 로드한다.
   */
  useEffect(() => {
    const cb = ({ edge }: PageOverflowEvent) => {
      console.log(`page ${edge === "start" ? "이전" : "다음"}으로 오버플로우`);

      let moved: ReadableTocNode | null;
      let readFrom: "start" | "end";
      if (edge === "start") {
        moved = moveLeadNode("prev");
        readFrom = "end"
      } else {
        moved = moveLeadNode("next");
        readFrom = "start";
      }

      if (moved !== null) {
        changeLeadNode({ id: moved.id, readFrom });
      }
    }
    readerEvent.on("page-overflow", cb);
    return () => {
      readerEvent.off("page-overflow", cb);
    }
  }, [resolveNextSection, moveLeadNode, changeLeadNode]);


  /**
   * 특정 이벤트가 발생한 경우, 다음 페이지가 충분히 준비될 수 있도록 추가적으로 section을 로드한다.
   */
  useEffect(() => {
    const cb = ({ currentPage, totalPageCount }: PageChangedEvent) => {
      resolveNextSection({
        current: currentPage,
        total: totalPageCount
      })
    }
    readerEvent.on("page-changed", cb);
    return () => {
      readerEvent.off("page-changed", cb);
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