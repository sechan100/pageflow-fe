'use client'
import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { ImagesPlugin } from '@/shared/lexical/ImagePlugin';
import { LexicalPlaceholder } from '@/shared/lexical/LexicalPlaceholder';
import { useLexicalEditorSerializedHtmlSync } from '@/shared/lexical/use-lexical-editor-serialized-html-sync';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { Box, SxProps } from "@mui/material";
import { Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { registerCtrlShortCut } from '../keyboard';

const plainTextEditorStyle: SxProps = {
  // Editor Root
  "[data-lexical-editor='true']": {
    outline: "none", // focus되었을 때 파란색 테두리 제거
    lineHeight: 2,
  },

  // Paragraph
  ".pf-p": {
    m: 0,
    textAlign: 'justify',
  },

  ".pf-image": {
    display: 'inline-block',
  },

  ".image-position-full": {
    display: 'block',
    textAlign: 'center',
    margin: '1em 0 1em 0',
  },

  ".image-position-left": {
    float: "left",
    margin: "1em 1em 0 0",
  },

  ".image-position-right": {
    float: "right",
    margin: "1em 0 0 1em",
  },
}


const placeholder = "내용을 입력해주세요.";

export type PlainTextEditorRef = {
  save: () => Promise<void>;
  canSave: boolean;
}
type PlainTextEditorProps = {
  html: string | null;
  editorName: string;
  onSave: (html: string) => Promise<void> | void;
  ref: Ref<PlainTextEditorRef>;
  imagePlugin?: boolean; // default: false
  ctrl_s_save?: boolean; // default: false
  sx?: SxProps;
}
const Editor = ({
  html,
  editorName,
  onSave,
  ref,
  imagePlugin = false,
  ctrl_s_save = false,
  sx
}: PlainTextEditorProps) => {
  const [editor] = useLexicalComposerContext();
  useLexicalEditorSerializedHtmlSync(html);

  const bufferRef = useRef<string>("");
  const canSave = bufferRef.current.length > 0;

  const save = useCallback(async () => {
    if (!canSave) {
      return;
    }
    await onSave(bufferRef.current);
    bufferRef.current = "";
  }, [canSave, onSave]);

  useImperativeHandle(ref, () => ({
    save,
    canSave,
  }), [canSave, save]);

  // save 단축키 등록
  useEffect(() => {
    const element = editor.getRootElement();
    if (!element) return;
    if (!ctrl_s_save) return;
    return registerCtrlShortCut({
      element,
      key: 's',
      cb: save,
    })
  }, [ctrl_s_save, editor, save]);

  return (
    <Box
      sx={{
        position: 'relative',
        ...plainTextEditorStyle,
      }}
    >
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={placeholder}
            placeholder={<LexicalPlaceholder text={placeholder} />}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      {imagePlugin && <ImagesPlugin />}
      {/* <TreeViewPlugin /> */}
    </Box>
  )
}

export const PlainTextEditor = (props: PlainTextEditorProps) => {
  const editorConfig = useMemo(() => ({
    namespace: props.editorName,
    nodes: props.imagePlugin ? [ImageNode] : [],
    onError(error: Error) {
      throw error;
    },
    theme: editorTheme,
  }), [props.editorName, props.imagePlugin]);


  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Editor {...props} />
    </LexicalComposer>
  )
}