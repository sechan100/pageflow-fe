'use client'
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
import { Container, SxProps } from "@mui/material";
import { editorStyle, SectionEditorTheme } from '../config/editor-theme';
import { LexicalBaseSettingPlugin } from './LexicalBaseSettingPlugin';
import { LoadEditorStatePlugin } from './LoadEditorStatePlugin';
import { PopperToolbarPlugin } from './PopperToolbarPlugin';



const editorConfig = {
  // html: {
  //   export: exportMap,
  //   import: constructImportMap(),
  // },
  namespace: 'Section Editor',
  nodes: [ListNode, ListItemNode, HorizontalRuleNode, HeadingNode, QuoteNode, CodeNode, LinkNode],
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
    <LexicalComposer initialConfig={editorConfig}>
      <Container
        maxWidth="md"
        sx={{
          my: 10,
          ...editorStyle,
        }}
      >
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
        <PopperToolbarPlugin />
        <LexicalBaseSettingPlugin />
        <LoadEditorStatePlugin htmlSerializedState={htmlContent} />
        <HistoryPlugin />
        <ListPlugin />
        <MarkdownShortcutPlugin />
        {/* <AutoFocusPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </Container>
    </LexicalComposer>
  )
}