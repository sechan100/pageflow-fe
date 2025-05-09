import { editorTheme } from '@/shared/lexical/editor-theme';
import { ImageNode } from '@/shared/lexical/ImageNode';
import { useLexicalEditorSerializedHtmlSync } from '@/shared/lexical/use-lexical-editor-serialized-html-sync';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { QuoteNode } from '@lexical/rich-text';
import { Box, SxProps, Typography } from '@mui/material';
import { EditorState, RootNode } from 'lexical';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReadableSectionContent } from "../../model/readable-content";
import { useReaderStyleStore } from '../../stores/reader-style-store';
import { CN_SECTION_CONTENT_ELEMENT, DATA_SECTION_CONTENT_ELEMENT_ID, DATA_TOC_SECTION_ID } from '../container/node-element';
import { SECTION_CONTENT_WRAPPER_CLASS_NAME } from '../container/readable-content';


type LexicalSettingsProps = {
  section: ReadableSectionContent;
}
const LexicalSettings = ({
  section,
}: LexicalSettingsProps) => {
  const [editor] = useLexicalComposerContext();
  const [updatedEditorState, setUpdatedEditorState] = useState<EditorState>(editor.getEditorState());
  useLexicalEditorSerializedHtmlSync(section.content);


  useEffect(() => editor.registerUpdateListener(({ editorState }) => {
    setUpdatedEditorState(editorState);
  }), [editor]);

  /**
   * editor가 업데이트되면 node들에 특정 클래스를 추가한다. 
   * 다만 registerUpdateListener가 실행되고, 이 editorState가 뷰에 적용되는데에는 시간이 걸리기 때문에, 
   * useEffect와 useState를 통해서 자연스럽게 editorState가 렌더링된 이후에 class 추가 로직의 실행을 꾀한다.
   */
  useEffect(() => {
    const nodes = updatedEditorState._nodeMap.values().toArray();
    let num = 0;
    for (const n of nodes) {
      if (n instanceof RootNode) continue;
      // if (!(n instanceof ElementNode)) continue;
      const el = editor.getElementByKey(n.getKey());
      if (el) {
        el.classList.add(CN_SECTION_CONTENT_ELEMENT);
        el.setAttribute(DATA_TOC_SECTION_ID, section.id);
        el.setAttribute(DATA_SECTION_CONTENT_ELEMENT_ID, String(num++));
      }
    }
  }, [editor, section.id, updatedEditorState]);

  return (
    <>

    </>
  )
}

type WrapperProps = {
  section: ReadableSectionContent;
  children: React.ReactNode;
  sx?: SxProps;
}
export const Wrapper = ({
  section,
  children,
  sx
}: WrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { viewportHeight } = useReaderStyleStore();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute(DATA_TOC_SECTION_ID, section.id);
  }, [section.id]);

  return (
    <Box
      component={"div"}
      ref={ref}
      className={SECTION_CONTENT_WRAPPER_CLASS_NAME}
      sx={{
        breakBefore: section.shouldBreakSection ? "column" : undefined,
      }}
    >
      {children}
    </Box>
  )
}

type TitleProps = {
  title: string;
  sx?: SxProps;
}
const Title = ({
  title,
  sx
}: TitleProps) => {
  const { lineHeight, fontSize, wordSpacing } = useReaderStyleStore();

  return (
    <Typography
      variant="h6"
      sx={{
        fontSize: fontSize * 1.1,
        wordSpacing,
        fontWeight: 600,
        pt: lineHeight * 5,
        pb: lineHeight * 0.5,
        userSelect: "none",
      }}
    >
      {title}
    </Typography>
  )
}


type Props = {
  section: ReadableSectionContent;
}
export const SectionContent = ({ section }: Props) => {
  const layout = useReaderStyleStore();
  const lexicalConfig = useMemo(() => ({
    namespace: `section-${section.id}-reader`,
    nodes: [ListNode, ListItemNode, QuoteNode, LinkNode, ImageNode],
    onError(error: Error) {
      throw error;
    },
    theme: editorTheme,
    editable: false,
  }), [section.id]);

  return (
    <Wrapper section={section}>
      {section.shouldShowTitle && <Title title={section.title} />}
      <LexicalComposer initialConfig={lexicalConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <LexicalSettings section={section} />
        {/* <TreeViewPlugin /> */}
      </LexicalComposer>
    </Wrapper>
  );
};