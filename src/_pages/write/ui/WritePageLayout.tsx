'use client'
import { EditorBookStoreProvider } from '@/entities/book'
import { Box, Container, SxProps } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getBookApi } from "../api/book"
import { sideDrawerWidth } from "../config/side-drawer-width"
import { SideDrawer } from "./SideDrawer"
import { TocContextProvider } from './TocContextProvider'
import { WritePageDialMenu } from './WritePageDialMenu'



type Props = {
  bookId: string
  children: React.ReactNode
  sx?: SxProps
}
export const WritePageLayout = ({
  bookId,
  children,
  sx
}: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBookApi(bookId)
  });
  const [open, setOpen] = useState(true);

  if (isLoading || !data) {
    return (<div>Loading...</div>)
  }
  if (data.code === 'error') {
    return (<div>{data.message}</div>)
  }

  const book = data.book;

  return (
    <EditorBookStoreProvider
      data={book}
      onDataChange={(s, book) => s.setState({ book })}
    >
      <TocContextProvider>
        <SideDrawer
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        />
        <Box
          sx={{
            marginLeft: open ? `${sideDrawerWidth}px` : 0,
            transition: 'margin-left 225ms cubic-bezier(0.4, 0, 0.6, 1)',
          }}
        >
          <Container sx={{ position: 'relative' }}>
            {children}
            <WritePageDialMenu />
          </Container>
        </Box>
      </TocContextProvider>
    </EditorBookStoreProvider>
  )
}