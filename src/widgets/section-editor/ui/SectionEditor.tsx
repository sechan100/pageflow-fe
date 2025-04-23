'use client'
import { AuthorPrivateBook } from '@/entities/book';
import { WithContentEditorSection } from '@/entities/editor';
import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { ImagesPlugin } from '@/shared/lexical/ImagePlugin';
import { LexicalPlaceholder } from '@/shared/lexical/LexicalPlaceholder';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { QuoteNode } from '@lexical/rich-text';
import { Box, Container, SxProps } from "@mui/material";
import { useCallback } from 'react';
import { sectionEditorStyle } from '../config/section-editor-style';
import { BookContextProvider } from '../model/book-context';
import { CharCountPlugin } from './CharCountPlugin';
import { FloatingToolbar, useToolbarStore } from './FloatingToolbar';
import { LexicalSettingPlugin } from './LexicalSettingPlugin';



const editorConfig = {
  namespace: 'Section Editor',
  nodes: [ListNode, ListItemNode, QuoteNode, ImageNode],
  onError(error: Error) {
    throw error;
  },
  theme: editorTheme,
};

const placeholder = "내용을 입력해주세요.";

type Props = {
  book: AuthorPrivateBook;
  section: WithContentEditorSection;
  sx?: SxProps
}
export const SectionEditor = ({
  book,
  section,
  sx
}: Props) => {
  const setToolbarOpen = useToolbarStore(s => s.setOpen);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setToolbarOpen(true);
  }, [setToolbarOpen]);

  return (
    <BookContextProvider value={book}>
      <LexicalComposer initialConfig={editorConfig}>
        <Container
          maxWidth="md"
          sx={{
            mt: 10,
            mb: 70,
            position: 'relative',
            ...sectionEditorStyle,
          }}
        >
          <CharCountPlugin />
          <Box sx={{ position: 'relative' }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  onContextMenu={onContextMenu}
                  aria-placeholder={placeholder}
                  placeholder={
                    <LexicalPlaceholder
                      text={placeholder}
                    />
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </Box>
          <FloatingToolbar sectionId={section.id} />
          <LexicalSettingPlugin sectionId={section.id} serializedHtml={section.content ?? null} />
          <HistoryPlugin />
          <ListPlugin />
          <ImagesPlugin />
          {/* <MarkdownPlugin /> */}
          {/* <AutoFocusPlugin /> */}
          {/* <TreeViewPlugin /> */}
        </Container>
      </LexicalComposer>
    </BookContextProvider>
  )
}