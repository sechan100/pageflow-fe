import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { CodeNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Box, Paper } from '@mui/material';


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
  content: string;
};
export const BookViewer = ({
  content
}: Props) => {

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
      <LexicalComposer initialConfig={viewerConfig}>
        <Box sx={{
          position: 'relative',
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          lineHeight: 1.6,
          color: '#333',
        }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  outline: 'none',
                  padding: '0',
                }}
              />
            }
            placeholder={null}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </Box>
      </LexicalComposer>
    </Paper>
  );
};
