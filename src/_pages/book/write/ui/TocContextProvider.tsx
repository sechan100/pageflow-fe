'use client'
import { TocStoreProvider, useEditorBookStore, useTocQuery } from "@/entities/book";
import { SxProps } from "@mui/material";



type Props = {
  children: React.ReactNode;
  sx?: SxProps;
}
export const TocContextProvider = ({
  children,
  sx
}: Props) => {
  const { book } = useEditorBookStore();
  const { data: svToc, isLoading } = useTocQuery(book.id);

  if (isLoading || svToc === undefined) {
    return <div>loading...</div>
  }
  return (
    <TocStoreProvider svToc={svToc}>
      {children}
    </TocStoreProvider>
  )
}