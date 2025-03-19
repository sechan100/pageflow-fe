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
import { getEditorStyle, SectionEditorTheme } from '../config/editor-theme';
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
  height: number,
  htmlContent?: string,
  sx?: SxProps
}
export const SectionEditor = ({
  height,
  htmlContent,
  sx
}: Props) => {

  return (
    <Box
      sx={{
        ...getEditorStyle({
          height: height * 0.8
        }),
        height,
      }}
    >
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarPlugin
          height={height * 0.2}
        />
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