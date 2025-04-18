'use client'
import { ReaderPosition } from "@/entities/reader";
import { SxProps } from "@mui/material";
import { useReadOnlyFolderQuery } from "../api/folder";
import { useReadOnlySectionQuery } from "../api/section";
import { ReaderPositionContextProvider, useReaderPosition } from "../model/book-context";
import { FolderViewer } from "./FolderViewer";
import { SectionViewer } from "./SectionViewer";


type FolderDispatcherProps = {
  bookId: string;
}
const FolderDispatcher = ({
  bookId,
}: FolderDispatcherProps) => {
  const position = useReaderPosition();
  const { data, isLoading } = useReadOnlyFolderQuery({ bookId, folderId: position.tocNodeId });
  if (isLoading || data === undefined) {
    return <div>폴더 로딩중...</div>
  }

  return (
    <FolderViewer folder={data} />
  )
}

type SectionDispatcherProps = {
  bookId: string;
}
const SectionDispatcher = ({
  bookId,
}: SectionDispatcherProps) => {
  const position = useReaderPosition();
  const { data, isLoading } = useReadOnlySectionQuery({ bookId, sectionId: position.tocNodeId });
  if (isLoading || data === undefined) {
    return <div>섹션 로딩중...</div>
  }

  return (
    <SectionViewer section={data} />
  )
}


type Props = {
  bookId: string;
  position: ReaderPosition;
  sx?: SxProps;
}
export const TocNodeViewer = ({
  bookId,
  position,
  sx
}: Props) => {
  const ppp: ReaderPosition = {
    tocNodeId: "2dd4acf4-5c11-4bad-bc63-0c8969ad2f92",
    tocNodeType: "SECTION",
    lexicalNodeKey: 1,
  }

  return (
    <ReaderPositionContextProvider value={ppp}>
      {
        position.tocNodeType === "FOLDER"
          ?
          <FolderDispatcher bookId={bookId} />
          :
          <SectionDispatcher bookId={bookId} />
      }
    </ReaderPositionContextProvider>
  )
}