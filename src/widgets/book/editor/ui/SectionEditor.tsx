'use client'
import { STYLES } from '@/global/styles';
import { CodeNode } from '@lexical/code';
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { Box, Container, SxProps } from "@mui/material";
import { useCallback } from 'react';
import { editorStyle, SectionEditorTheme } from '../config/editor-theme';
import { EditorDial } from './EditorDial';
import { ImageNode } from './ImageNode';
import { ImagesPlugin } from './ImagePlugin';
import { LexicalBaseSettingPlugin } from './LexicalBaseSettingPlugin';
import { LoadEditorStatePlugin } from './LoadEditorStatePlugin';
import { PopperToolbar, useToolbarStore } from './PopperToolbar';



const editorConfig = {
  // html: {
  //   export: exportMap,
  //   import: constructImportMap(),
  // },
  namespace: 'Section Editor',
  nodes: [ListNode, ListItemNode, HorizontalRuleNode, HeadingNode, QuoteNode, CodeNode, LinkNode, ImageNode],
  onError(error: Error) {
    throw error;
  },
  theme: SectionEditorTheme,
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
  const setOpen = useToolbarStore(s => s.setOpen);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  }, [setOpen]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Container
        maxWidth="md"
        sx={{
          my: 10,
          position: 'relative',
          ...editorStyle,
        }}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              onContextMenu={onContextMenu}
              aria-placeholder={placeholder}
              placeholder={
                <Box sx={{
                  display: 'inline-block',
                  borderTop: STYLES.border.solid,
                }}>
                  {placeholder}
                </Box>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <PopperToolbar />
        <LexicalBaseSettingPlugin />
        <LoadEditorStatePlugin htmlSerializedState={htmlContent} />
        <HistoryPlugin />
        <ListPlugin />
        <ImagesPlugin />
        <MarkdownShortcutPlugin />
        {/* <AutoFocusPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </Container>
      <EditorDial sectionId={sectionId} />
    </LexicalComposer>
  )
}