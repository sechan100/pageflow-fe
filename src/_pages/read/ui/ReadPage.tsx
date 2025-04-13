import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { BookViewer } from './BookViewer';
import { TocSidebar } from './TocSidebar';

interface ReadPageProps {
  bookId?: string;
  bookTitle?: string;
  bookContent?: string;
  toc?: any[];
  loading?: boolean;
  onBack?: () => void;
}

export const ReadPage: React.FC<ReadPageProps> = ({
  bookTitle = '책 읽기',
  bookContent = '',
  toc = [],
  loading = false,
  onBack = () => { },
}) => {
  const [tocOpen, setTocOpen] = React.useState(false);

  const handleTocToggle = () => {
    setTocOpen(!tocOpen);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
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
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          돌아가기
        </Button>
        <Button
          startIcon={<MenuIcon />}
          onClick={handleTocToggle}
          sx={{ mr: 2 }}
        >
          목차
        </Button>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {bookTitle}
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden'
      }}>
        <TocSidebar
          toc={toc}
          open={tocOpen}
          onClose={() => setTocOpen(false)}
        />

        <Box sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 3,
          maxWidth: tocOpen ? 'calc(100% - 300px)' : '100%',
          transition: 'max-width 0.3s ease'
        }}>
          <BookViewer content={bookContent} />
        </Box>
      </Box>
    </Box>
  );
};
