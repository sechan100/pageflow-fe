'use client'
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Box, SxProps } from "@mui/material";
import "../config/editor-style.css";
import { SectionEditorTheme } from '../config/editor-theme';
import { LexicalBaseSettingPlugin } from './LexicalBaseSettingPlugin';
import { LoadEditorStatePlugin } from './LoadEditorStatePlugin';
import { ToolbarPlugin } from './ToolbarPlugin';



const editorConfig = {
  // html: {
  //   export: exportMap,
  //   import: constructImportMap(),
  // },
  namespace: 'Section Editor',
  nodes: [ListNode, ListItemNode],
  onError(error: Error) {
    throw error;
  },
  theme: SectionEditorTheme,
};

const placeholder = "Enter some text...";

type Props = {
  htmlContent?: string,
  sx?: SxProps
}
export const SectionEditor = ({
  htmlContent,
  sx
}: Props) => {

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder={placeholder}
              placeholder={
                <div className="editor-placeholder">{placeholder}</div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LexicalBaseSettingPlugin />
        <LoadEditorStatePlugin htmlSerializedState={htmlContent} />
        <HistoryPlugin />
        <ListPlugin />
        <AutoFocusPlugin />
        {/* <TreeViewPlugin /> */}
      </LexicalComposer>
    </Box>
  )
}