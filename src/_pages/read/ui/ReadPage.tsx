import { PublishedBook, usePublishedBookQuery } from '@/entities/book';
import { useNextRouter } from '@/shared/hooks/useNextRouter';
import { ReaderToc } from '@/widgets/reader-toc';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { PublishedBookContextProvider } from '../model/published-book-context';
import { ReaderTocStoreContextProvider, useReaderTocStore } from '../model/reader-toc-store';
import { NodeViewer } from './NodeViewer';


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
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Box sx={{
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
        </Box>

        <Box sx={{
          display: 'flex',
          flexGrow: 1,
          overflow: 'hidden'
        }}>
          <ReaderToc
            book={book}
            tocStore={useReaderTocStore}
          />

          <Box sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 3,
            maxWidth: open ? 'calc(100% - 300px)' : '100%',
            transition: 'max-width 0.3s ease'
          }}>
            <NodeViewer />
          </Box>
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
    <PublishedBookContextProvider value={book}>
      <ReaderTocStoreContextProvider data={book.toc}>
        <ReadPageContent book={book} />
      </ReaderTocStoreContextProvider>
    </PublishedBookContextProvider>
  );
};
