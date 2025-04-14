'use client'
import { EditorToc, getEditorTocApi } from "@/entities/editor";
import { SxProps } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useBookContext } from "../model/book-context";
import { EditorTocStoreContextProvider } from "../model/editor-toc-store";



type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const TocContextProvider = ({
  children,
  sx
}: Props) => {
  const book = useBookContext();
  const [toc, setToc] = useState<EditorToc | null>(null);

  const refreshToc = useCallback(async () => {
    const toc = await getEditorTocApi(book.id);
    setToc(toc);
  }, [book.id]);

  useEffect(() => {
    if (toc === null) {
      refreshToc();
    }
  }, [book.id, refreshToc, toc]);

  if (toc === null) {
    return <div>Loading...</div>
  }

  return (
    <EditorTocStoreContextProvider data={toc} onDataChange={(s, newToc) => s.getState().setToc(newToc)}>
      {children}
    </EditorTocStoreContextProvider>
  )
}