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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { createStore, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { registerCtrlShortCut } from '../keyboard';
import { $getHtmlSerializedEditorState } from '../lexical/$getHtmlSerializedEditorState';
import { useUserInputChangeUpdateListener } from '../lexical/use-user-input-change-update-listener';

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

type SaveMethod = () => Promise<void> | void;
type OnSaveMethod = (html: string) => Promise<void> | void;
export type PlainTextEditorStore = {
  initialHtml: string | null;
  editorName: string;
  save: SaveMethod;
  _onSave: OnSaveMethod;
  imagePlugin: boolean;
  ctrl_s_save: boolean;
  canSave: boolean;
  registerSaveListener: (onSave: OnSaveMethod) => void;
  setCanSave: (canSave: boolean) => void;
  _setSave: (saveMethod: SaveMethod) => void;
}
export const createPlainTextEditorStore = (args: {
  initialHtml: string | null;
  editorName: string;
  imagePlugin?: boolean; // default: false
  ctrl_s_save?: boolean; // default: false
}) => createStore<PlainTextEditorStore>()(
  subscribeWithSelector((set) => ({
    initialHtml: args.initialHtml,
    editorName: args.editorName,
    imagePlugin: args.imagePlugin || false,
    ctrl_s_save: args.ctrl_s_save || false,
    save: () => { throw new Error("save method가 아직 설정되지 않았습니다."); },
    _setSave: (saveMethod: SaveMethod) => set({ save: saveMethod }),
    canSave: false,
    setCanSave: (canSave: boolean) => set({ canSave }),
    _onSave: () => { throw new Error("onSave method가 아직 설정되지 않았습니다."); },
    registerSaveListener: (_onSave: OnSaveMethod) => set({ _onSave }),
  }))
);
export type PlainTextEditorStoreApi = ReturnType<typeof createPlainTextEditorStore>;

type PlainTextEditorProps = {
  store: PlainTextEditorStoreApi;
}
const Editor = ({
  store,
}: PlainTextEditorProps) => {
  const [editor] = useLexicalComposerContext();
  useLexicalEditorSerializedHtmlSync(store.getState().initialHtml);
  const ctrl_s_save = useStore(store, s => s.ctrl_s_save);

  const bufferRef = useRef<string>("");
  const setBuffer = useCallback((html: string) => {
    bufferRef.current = html;
    store.getState().setCanSave(html.length > 0);
  }, [store]);

  // editor의 내용이 변경될 때마다 상태에 저장
  useUserInputChangeUpdateListener(editor => {
    editor.read(() => {
      const html = $getHtmlSerializedEditorState();
      setBuffer(html);
    });
  });

  const save = useCallback(async () => {
    const { _onSave, canSave } = store.getState();
    if (!canSave) {
      return;
    }
    await _onSave(bufferRef.current);
    setBuffer("");
  }, [setBuffer, store]);

  // store에 save 메소드 등록
  useEffect(() => {
    store.getState()._setSave(save);
  }, [save, store]);

  // save 단축키 등록
  useEffect(() => {
    const element = editor.getRootElement();
    if (!element) return;
    if (!ctrl_s_save) return;
    const cleanup = registerCtrlShortCut({
      element,
      key: 's',
      cb: save,
    })
    return cleanup;
  }, [ctrl_s_save, editor, save, store]);

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
      {store.getState().imagePlugin && <ImagesPlugin />}
      {/* <TreeViewPlugin /> */}
    </Box>
  )
}

export const PlainTextEditor = ({ store }: PlainTextEditorProps) => {
  const editorConfig = useMemo(() => ({
    namespace: store.getState().editorName,
    nodes: store.getState().imagePlugin ? [ImageNode] : [],
    onError(error: Error) {
      throw error;
    },
    theme: editorTheme,
  }), [store]);


  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Editor store={store} />
    </LexicalComposer>
  )
}