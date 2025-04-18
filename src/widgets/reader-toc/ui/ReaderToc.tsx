'use client'
import { PublishedBook } from "@/entities/book";
import { ReaderTocStore } from "@/entities/reader";
import { ZustandStore } from "@/shared/zustand/zustand-store";
import { SxProps } from "@mui/material";
import { PublishedBookContextProvider } from "../model/book-context";
import { ReaderTocStoreContextProvider } from "../model/reader-store";
import { ReaderTocSidebar } from "./ReaderTocSidebar";



type Props = {
  book: PublishedBook;
  tocStore: ZustandStore<ReaderTocStore>;
  sx?: SxProps;
}
export const ReaderToc = ({
  book,
  tocStore,
  sx
}: Props) => {

  return (
    <PublishedBookContextProvider value={book}>
      <ReaderTocStoreContextProvider store={tocStore}>
        <ReaderTocSidebar />
      </ReaderTocStoreContextProvider>
    </PublishedBookContextProvider>
  )
}