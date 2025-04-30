import { PublishedBook, usePublishedBookQuery } from '@/entities/book';
import { useNextRouter } from '@/shared/hooks/useNextRouter';
import { Box, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { BookContextProvider } from '../model/context/book-context';
import { TocContextProvider } from "../model/context/toc-context";
import { BookReader } from './BookReader';
import { ReadPageDialMenu } from './ReadPageDialMenu';


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
          {/* <ReaderToc /> */}
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
        <ReadPageContent book={book} />
      </TocContextProvider>
    </BookContextProvider>
  );
};
