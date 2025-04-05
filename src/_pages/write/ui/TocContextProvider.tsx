'use client'
import { EditorTocStoreProvider, getTocApi, SvToc } from "@/entities/book";
import { SxProps } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useBookContext } from "../model/book-context";



type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const TocContextProvider = ({
  children,
  sx
}: Props) => {
  const book = useBookContext();
  const [svToc, setSvToc] = useState<SvToc | null>(null);

  const refreshToc = useCallback(async () => {
    const toc = await getTocApi(book.id);
    setSvToc(toc);
  }, [book.id]);

  useEffect(() => {
    if (svToc === null) {
      refreshToc();
    }
  }, [book.id, refreshToc, svToc]);

  if (svToc === null) {
    return <div>Loading...</div>
  }
  return (
    <EditorTocStoreProvider svToc={svToc}>
      {children}
    </EditorTocStoreProvider>
  )
}