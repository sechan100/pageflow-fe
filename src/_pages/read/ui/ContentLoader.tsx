'use client'
import { SxProps } from "@mui/material";
import { useEffect } from "react";
import { usePositionStore } from "../model/position";
import { pageChangedEvent } from "../model/reader-event";
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
  const { prev, position, next } = usePositionStore();
  const { setLeaderFolder, fetchNextSection, isFullyLoaded, folder, leadFolder, sections } = useReadableUnit();
  console.log("leadFolder", leadFolder, "sections", sections);

  // 최초만 실행
  useEffect(() => {
    setLeaderFolder(startingFolderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    const removeListener = pageChangedEvent.registerListener(({ page, totalPages }) => {
      // 전체 페이지보다 1개 이전 페이지에 위치해있을 때,
      if (page >= (totalPages - 1) - 1) {
        fetchNextSection();
      }
    })
    return () => {
      removeListener();
    }
  }, [fetchNextSection, setLeaderFolder]);


  return (
    <>
      <FolderContent folder={folder} />
      {sections.map((content) => (
        <SectionContent key={content.id} section={content} />
      ))}
    </>
  )
}