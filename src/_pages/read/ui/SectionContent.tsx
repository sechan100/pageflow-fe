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
import { SxProps, Typography } from '@mui/material';
import { EditorState, RootNode } from 'lexical';
import { useEffect, useMemo, useState } from 'react';
import { ReadableSectionContent } from "../model/readable-content";
import { useNormalizedLexicalNodeKey } from '../model/use-cnkey';
import { useLayoutStore } from '../model/use-reader-layout-store';
import { SECTION_CONTENT_DATA_NODE_ID } from './logic/content-element';
import { SectionContentWrapper } from './SectionContentWrapper';


type LexicalSettingsProps = {
  section: ReadableSectionContent;
}
const LexicalSettings = ({
  section,
}: LexicalSettingsProps) => {
  const [editor] = useLexicalComposerContext();
  useNormalizedLexicalNodeKey();
  useLexicalEditorSerializedHtmlSync(section.content);


  const [updatedEditorState, setUpdatedEditorState] = useState<EditorState>(editor.getEditorState());
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
    for (const n of nodes) {
      if (n instanceof RootNode) continue;
      // if (!(n instanceof ElementNode)) continue;
      const el = editor.getElementByKey(n.getKey());
      if (el) {
        el.classList.add('reader-lexical-node');
        el.setAttribute(SECTION_CONTENT_DATA_NODE_ID, section.id);
      }
    }
  }, [editor, section.id, updatedEditorState]);

  return (
    <>

    </>
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
  const { lineHeight, fontSize, wordSpacing } = useLayoutStore();

  return (
    <Typography
      variant="h6"
      sx={{
        fontSize: fontSize * 1.2,
        wordSpacing,
        pt: lineHeight * 0.7,
        pb: lineHeight * 0.3,
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
  const layout = useLayoutStore();
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
    <SectionContentWrapper section={section}>
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
    </SectionContentWrapper>
  );
};