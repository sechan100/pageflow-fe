'use client'
import { useEditorBookStore } from '@/entities/book';
import { $getHtmlSerializedEditorState } from '@/shared/lexical/$getHtmlSerializedEditorState';
import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { ImagesPlugin } from '@/shared/lexical/ImagePlugin';
import { LexicalPlaceholder } from '@/shared/lexical/LexicalPlaceholder';
import { MarkdownPlugin } from '@/shared/lexical/MarkdownPlugin';
import { useLexicalEditorSerializedHtmlSync } from '@/shared/lexical/use-lexical-editor-serialized-html-sync';
import { useUserInputChangeUpdateListener } from '@/shared/lexical/use-user-input-change-update-listener';
import { registerCtrlShortCut } from '@/shared/register-ctrl-short-cut';
import { useNotification } from '@/shared/ui/notification';
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Box, Button, Container, SxProps } from "@mui/material";
import { useCallback, useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { useChangeBookDescriptionMutation } from '../api/change-book-description';
import { bookDescriptionEditorStyle } from '../config/book-description-editor-style';


const editorConfig = {
  namespace: 'Description Editor',
  nodes: [ListNode, ListItemNode, HeadingNode, QuoteNode, CodeNode, LinkNode, ImageNode],
  onError(error: Error) {
    throw error;
  },
  theme: editorTheme,
};


const placeholder = "내용을 입력해주세요.";


type DescriptionBufferStore = {
  description: string;
  setDescription: (description: string) => void;
  clearDescription: () => void;
}
const useDescriptionBufferStore = create<DescriptionBufferStore>((set, get) => ({
  description: '',
  setDescription: (description: string) => set({ description }),
  clearDescription: () => set({ description: '' }),
}));


const useSaveDescription = () => {
  const { id: bookId } = useEditorBookStore(s => s.book);
  const notification = useNotification();
  const { description, clearDescription } = useDescriptionBufferStore();
  const { mutateAsync: saveDescriptionApi } = useChangeBookDescriptionMutation(bookId);

  const saveDescription = useCallback(async () => {
    if (description.length === 0) {
      return;
    }

    const res = await saveDescriptionApi(description);
    if (res.success) {
      notification.success('저장되었습니다.');
      clearDescription();
    } else {
      notification.error('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [clearDescription, description, notification, saveDescriptionApi]);

  return {
    saveDescription,
  }
}


type EditorProps = {
  serializedHtml: string | null,
  sx?: SxProps;
}
const Editor = ({
  serializedHtml,
  sx
}: EditorProps) => {
  const [editor] = useLexicalComposerContext();
  const { saveDescription } = useSaveDescription();
  const { setDescription } = useDescriptionBufferStore();
  useLexicalEditorSerializedHtmlSync(serializedHtml);

  // editor의 내용이 변경될 때마다 상태에 저장
  useUserInputChangeUpdateListener(editor => {
    editor.read(() => {
      const html = $getHtmlSerializedEditorState();
      setDescription(html);
    });
  });

  // save 단축키 등록
  useEffect(() => registerCtrlShortCut({
    element: editor.getRootElement(),
    key: 's',
    cb: saveDescription,
  }), [editor, saveDescription]);

  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          mt: 1,
          mb: 3,
          position: 'relative',
          ...bookDescriptionEditorStyle,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
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
        <HistoryPlugin />
        <ListPlugin />
        <ImagesPlugin />
        <MarkdownPlugin />
        {/* <AutoFocusPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </Container>
    </>
  )
}


type Props = {
  htmlContent: string,
  sx?: SxProps;
}
export const BookDescriptionEditor = ({
  htmlContent,
  sx
}: Props) => {
  const { description } = useDescriptionBufferStore();
  const canSave = useMemo(() => description.length > 0, [description]);
  const { saveDescription } = useSaveDescription();

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <Editor
          serializedHtml={htmlContent ?? null}
        />
        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
        }}>
          <Button
            variant="outlined"
            disabled={!canSave}
            onClick={saveDescription}
          >
            저장하기
          </Button>
        </Box>
      </LexicalComposer>
    </>
  )
}