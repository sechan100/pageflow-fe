import { PublishedBook, usePublishedBookQuery } from '@/entities/book';
import { useNextRouter } from '@/shared/hooks/useNextRouter';
import { Box, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { BookContextProvider } from '../stores/book-context';
import { BookmarkStoreProvider } from '../stores/bookmark-store';
import { ReadingUnitContextProvider } from '../stores/reading-unit-store';
import { TocContextProvider } from "../stores/toc-context";
import { BookReader } from './BookReader';
import { ReadPageDialMenu } from './ReadPageDialMenu';
import { SideDrawer } from './side-drawer/SideDrawer';


type ReadPageContentProps = {
  book: PublishedBook;
}
const ReadPageContent = ({
  book,
}: ReadPageContentProps) => {
  const { router } = useNextRouter();
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* <Box sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f9f9f9'
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mr: 2 }}
          >
            돌아가기
          </Button>
          <Button
            startIcon={<MenuIcon />}
            onClick={handleToggle}
            sx={{ mr: 2 }}
          >
            목차
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {book.title}
          </Typography>
        </Box> */}

        <Box sx={{
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}>
          <SideDrawer />
          <BookReader />
          <ReadPageDialMenu />
        </Box>
      </Box>
    </>
  )
}

type Props = {
  bookId: string;
}
export const ReadPage = ({ bookId }: Props) => {
  const { data: book, isLoading } = usePublishedBookQuery(bookId);

  if (isLoading || book === undefined) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <BookContextProvider value={book}>
      <TocContextProvider value={book.toc}>
        <BookmarkStoreProvider bookId={book.id}>
          <ReadingUnitContextProvider data={{ bookId: book.id, toc: book.toc }}>
            <ReadPageContent book={book} />
          </ReadingUnitContextProvider>
        </BookmarkStoreProvider>
      </TocContextProvider>
    </BookContextProvider>
  );
};
