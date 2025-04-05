'use client'
import { LexicalPlaceholder } from '@/shared/ui/LexicalPlaceholder';
import { CodeNode } from '@lexical/code';
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Box, Container, SxProps } from "@mui/material";
import { useCallback } from 'react';
import { editorStyle, sectionEditorTheme } from '../config/editor-theme';
import { FloatingToolbar, useToolbarStore } from './FloatingToolbar';
import { ImageNode } from './ImageNode';
import { ImagesPlugin } from './ImagePlugin';
import { LexicalSettingPlugin } from './LexicalSettingPlugin';
import { MarkdownPlugin } from './MarkdownPlugin';



const editorConfig = {
  namespace: 'Section Editor',
  nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, CodeNode, LinkNode, ImageNode],
  onError(error: Error) {
    throw error;
  },
  theme: sectionEditorTheme,
};

const placeholder = "내용을 입력해주세요.";

type Props = {
  sectionId: string,
  htmlContent?: string,
  sx?: SxProps
}
export const SectionEditor = ({
  sectionId,
  htmlContent,
  sx
}: Props) => {
  const setToolbarOpen = useToolbarStore(s => s.setOpen);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setToolbarOpen(true);
  }, [setToolbarOpen]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Container
        maxWidth="md"
        sx={{
          mt: 10,
          mb: 70,
          position: 'relative',
          ...editorStyle,
        }}
      >
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
        <FloatingToolbar sectionId={sectionId} />
        <LexicalSettingPlugin sectionId={sectionId} serializedHtml={htmlContent ?? null} />
        <HistoryPlugin />
        <ListPlugin />
        <ImagesPlugin />
        <MarkdownPlugin />
        {/* <AutoFocusPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </Container>
    </LexicalComposer>
  )
}