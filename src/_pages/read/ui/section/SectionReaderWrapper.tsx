'use client';

import { useReadableSectionQuery } from "../../api/section";
import { useBookContext } from "../../model/book-context";
import { usePositionStore } from "../../model/position";
import { SectionReader } from "./SectionReader";


export const SectionReaderWrapper = () => {
  const bookId = useBookContext().id;
  const position = usePositionStore(s => s.position);
  const { data, isLoading } = useReadableSectionQuery({ bookId, sectionId: position.tocNodeId });
  if (isLoading || data === undefined) {
    return <div>섹션 로딩중...</div>
  }

  return (
    <>
      <SectionReader section={data} />
    </>
  )
}