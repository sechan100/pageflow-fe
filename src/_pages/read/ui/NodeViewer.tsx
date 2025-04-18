'use client'
import { TocNodeViewer } from "@/widgets/viewer";
import { SxProps } from "@mui/material";
import { usePublishedBookContext } from "../model/published-book-context";
import { useReaderTocStore } from "../model/reader-toc-store";



type Props = {
  sx?: SxProps;
}
export const NodeViewer = ({
  sx
}: Props) => {
  const book = usePublishedBookContext();
  const position = useReaderTocStore(s => s.position);

  return (
    <>
      <TocNodeViewer
        bookId={book.id}
        position={position}
      />
    </>
  )
}