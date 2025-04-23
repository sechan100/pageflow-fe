import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Paper, Typography } from '@mui/material';
import { ReadableFolderContent } from '../model/readable-folder';
import { useLayoutStore } from '../model/use-reader-layout-store';


const viewerConfig = {
  namespace: 'Section Viewer',
  nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, CodeNode, LinkNode, ImageNode],
  onError(error: Error) {
    throw error;
  },
  theme: editorTheme,
  editable: false,
};

type Props = {
  folder: ReadableFolderContent;
};
export const FolderContent = ({
  folder,
}: Props) => {
  const layout = useLayoutStore();

  return (
    <Paper elevation={0} sx={{
      p: 4,
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '90vh',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      borderRadius: '8px',
    }}>
      <Typography>
        나는 폴더다 {folder.title}
      </Typography>
    </Paper>
  );
};
