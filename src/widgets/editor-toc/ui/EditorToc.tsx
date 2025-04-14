'use client'
import { AuthorPrivateBook } from "@/entities/book";
import { EditorTocStore } from "@/entities/editor";
import { ZustandStore } from "@/shared/zustand/zustand-store";
import { Box } from "@mui/material";
import { BookContextProvider } from "../model/book-context";
import { EditorTocStoreContextProvider } from "../model/editor-toc-store-context";
import { TocRoot } from "./TocRoot";
import { TocToolBar } from "./TocToolBar";


type Props = {
  book: AuthorPrivateBook;
  editorTocStore: ZustandStore<EditorTocStore>;
}
export const EditorToc = ({
  book,
  editorTocStore,
}: Props) => {

  return (
    <BookContextProvider value={book}>
      <EditorTocStoreContextProvider store={editorTocStore}>
        <TocToolBar />
        <Box
          sx={{
            overflowY: "auto",
            height: "100%",
          }}
        >
          <TocRoot />
        </Box>
      </EditorTocStoreContextProvider>
    </BookContextProvider>
  )
}