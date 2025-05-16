'use client'
import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { ImagesPlugin } from '@/shared/lexical/ImagePlugin';
import { LexicalPlaceholder } from '@/shared/lexical/LexicalPlaceholder';
import { useLexicalEditorSerializedHtmlSync } from '@/shared/lexical/use-lexical-editor-serialized-html-sync';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { Box, SxProps } from "@mui/material";
import { $getRoot, ElementNode } from 'lexical';
import { useEffect, useMemo } from 'react';
import { createStore, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { $getHtmlSerializedEditorState } from '../lexical/$getHtmlSerializedEditorState';
import { useUserInputChangeUpdateListener } from '../lexical/use-user-input-change-update-listener';

const $hasImageNodeRecursive = (parent: ElementNode): boolean => {
  const children = parent.getChildren();
  for (const child of children) {
    if (child.getType() === ImageNode.getType()) {
      return true;
    }
    if (child instanceof ElementNode) {
      const hasImageNode = $hasImageNodeRecursive(child);
      if (hasImageNode) {
        return true;
      }
    }
  }
  return false;
}

const isHtmlEmpty = (html: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return doc.body.innerHTML === "";
}

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


export type PlainTextEditorStore = {
  initialHtml: string | null;
  html: string;
  /**
   * 실제 내용이 비어있는 경우 true.
   * 만약 imagePlugin을 사용한다면, 이미지만 포함된 경우에 false.
   */
  isHtmlEmpty: boolean;
  placeholder: string;
  editorName: string;
  imagePlugin: boolean;
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
}
export const createPlainTextEditorStore = (args: {
  initialHtml: string | null;
  editorName: string;
  placeholder?: string;
  imagePlugin?: boolean; // default: false
  readOnly?: boolean; // default: false
}) => createStore<PlainTextEditorStore>()(subscribeWithSelector((set) => ({
  initialHtml: args.initialHtml,
  html: args.initialHtml || "",
  isHtmlEmpty: isHtmlEmpty(args.initialHtml || ""),
  editorName: args.editorName,
  placeholder: args.placeholder || "내용을 입력해주세요.",
  imagePlugin: args.imagePlugin || false,
  readOnly: args.readOnly || false,
  setReadOnly: (readOnly: boolean) => set({ readOnly }),
})));

export type PlainTextEditorStoreApi = ReturnType<typeof createPlainTextEditorStore>;

type PlainTextEditorProps = {
  store: PlainTextEditorStoreApi;
}
const Editor = ({
  store,
}: PlainTextEditorProps) => {
  const [editor] = useLexicalComposerContext();
  useLexicalEditorSerializedHtmlSync(store.getState().initialHtml);
  const placeholder = useStore(store, s => s.placeholder);
  const readOnly = useStore(store, s => s.readOnly);

  // editor의 내용이 변경될 때마다 상태에 저장
  useUserInputChangeUpdateListener(editor => {
    editor.read(() => {
      const html = $getHtmlSerializedEditorState();
      const isEmpty = $getRoot().getTextContent().length === 0;
      const isHaveImageNode = $hasImageNodeRecursive($getRoot());
      store.setState({
        html,
        isHtmlEmpty: isEmpty && !isHaveImageNode,
      });
    });
  });

  // readOnly 상태 동기화
  useEffect(() => {
    const newEditable = !readOnly;
    if (editor.isEditable() !== newEditable) {
      editor.setEditable(newEditable);
    }
  }, [editor, readOnly, store]);

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
            spellCheck={false}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      {store.getState().imagePlugin && <ImagesPlugin />}
      {/* <TreeViewPlugin /> */}
    </Box>
  )
}

export const PlainTextEditor = ({ store }: PlainTextEditorProps) => {
  const editorConfig = useMemo<InitialConfigType>(() => ({
    namespace: store.getState().editorName,
    nodes: store.getState().imagePlugin ? [ImageNode] : [],
    onError(error: Error) {
      throw error;
    },
    theme: editorTheme,
    editable: !store.getState().readOnly,
  }), [store]);


  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Editor store={store} />
    </LexicalComposer>
  )
}