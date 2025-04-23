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
import { Typography } from '@mui/material';
import { EditorState, RootNode } from 'lexical';
import { useEffect, useMemo, useState } from 'react';
import { ReadableSectionContent } from "../model/readable-content";
import { useNormalizedLexicalNodeKey } from '../model/use-cnkey';
import { NodeContentWrapper } from './NodeContentWrapper';


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
        el.setAttribute('data-toc-section-id', section.id);
      }
    }
  }, [editor, section.id, updatedEditorState]);

  return (
    <>

    </>
  )
}


type Props = {
  section: ReadableSectionContent;
}
export const SectionContent = ({ section }: Props) => {
  const lexicalConfig = useMemo(() => ({
    namespace: `section-${section.id}-reader`,
    nodes: [ListNode, ListItemNode, QuoteNode, LinkNode, ImageNode],
    onError(error: Error) {
      throw error;
    },
    theme: editorTheme,
    editable: false,
  }), [section.id]);

  const content = `<p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">1945년 해방 직후, 경상남도 통영의 작은 어촌 마을. 파도 소리가 끊임없이 들려오는 해안가에 오래된 목조 가옥 하나가 서 있었다. 이 집은 강 가문이 3대째 살아온 곳으로, 바다를 마주한 창문에서는 항상 소금기 섞인 바람이 들어왔다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">강민호는 그날 아침에도 여느 때와 다름없이 일찍 일어났다. 마흔 둘의 나이에도 그의 등허리는 여전히 곧았고, 손에는 어부의 거친 굳은살이 박혀 있었다. 그는 부엌에서 아내 윤지수가 아침 식사를 준비하는 소리를 들으며 현관문을 열었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"또 이렇게 일찍 나가시나요?" 지수가 부엌에서 소리쳤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 조용히 웃으며 대답했다. "바다는 기다려주지 않아. 오늘은 좋은 물고기가 많이 잡힐 것 같아."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 남편에게 따뜻한 차 한 잔을 건네주었다. 그녀의 얼굴에는 세월의 흔적이 조금씩 새겨지고 있었지만, 여전히 아름다웠다. 스물한 살에 결혼했으니 벌써 이십 년이 흘렀다. 그동안 세 아이를 낳고 키우며 바다와 싸우는 남편을 지켜봤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"오늘은 일찍 돌아오세요. 영호가 서울에서 편지를 보냈어요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호의 눈이 반짝였다. 큰아들 영호는 서울대학교에 진학해 공부하고 있었다. 가난한 어부의 아들이지만, 머리가 좋아 장학금을 받아 대학에 갈 수 있었다. 민호에게는 큰 자랑이었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"무슨 내용이던가?"</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"그건 돌아오시면 함께 읽어봐요. 아, 그리고 막내가 열이 좀 있는 것 같아요. 약을 사와야 할 것 같아요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 주머니를 뒤적이다가 몇 장의 지폐를 꺼내 지수에게 건넸다. "이걸로 약도 사고, 아이들 간식도 좀 사다 줘."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 고마운 마음으로 돈을 받았다. 어려운 시기였지만, 민호는 항상 가족을 먼저 생각했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"조심히 다녀오세요." 지수가 문간에서 남편을 배웅했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 고개를 끄덕이며 집을 나섰다. 새벽 공기는 차갑고 습했다. 바다에서 불어오는 바람이 그의 얼굴을 스쳐 지나갔다. 그는 익숙한 길을 따라 .</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"형님, 여기가 좋을 것 같습니다." 민석의 목소리에 민호는 생각에서 깨어났다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">그들은 그물을 던지기 시작했다. 날카로운 갈매기 소리와 함께, 하루의 일과가 시작되었다.1945년 해방 직후, 경상남도 통영의 작은 어촌 마을. 파도 소리가 끊임없이 들려오는 해안가에 오래된 목조 가옥 하나가 서 있었다. 이 집은 강 가문이 3대째 살아온 곳으로, 바다를 마주한 창문에서는 항상 소금기 섞인 바람이 들어왔다.</span></p><h1 class="pf-h1" dir="ltr"><span style="white-space: pre-wrap;">안녕하세요</span></h1><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">강민호는 그날 아침에도 여느 때와 다름없이 일찍 일어났다. 마흔 둘의 나이에도 그의 등허리는 여전히 곧았고, 손에는 어부의 거친 굳은살이 박혀 있었다. 그는 부엌에서 아내 윤지수가 아침 식사를 준비하는 소리를 들으며 현관문을 열었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"또 이렇게 일찍 나가시나요?" 지수가 부엌에서 소리쳤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 조용히 웃으며 대답했다. "바다는 기다려주지 않아. 오늘은 좋은 물고기가 많이 잡힐 것 같아."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 남편에게 따뜻한 차 한 잔을 건네주었다. 그녀의 얼굴에는 세월의 흔적이 조금씩 새겨지고 있었지만, 여전히 아름다웠다. 스물한 살에 결혼했으니 벌써 이십 년이 흘렀다. 그동안 세 아이를 낳고 키우며 바다와 싸우는 남편을 지켜봤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"오늘은 일찍 돌아오세요. 영호가 서울에서 편지를 보냈어요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호의 눈이 반짝였다. 큰아들 영호는 서울대학교에 진학해 공부하고 있었다. 가난한 어부의 아들이지만, 머리가 좋아 장학금을 받아 대학에 갈 수 있었다. 민호에게는 큰 자랑이었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"무슨 내용이던가?"</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"그건 돌아오시면 함께 읽어봐요. 아, 그리고 막내가 열이 좀 있는 것 같아요. 약을 사와야 할 것 같아요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 주머니를 뒤적이다가 몇 장의 지폐를 꺼내 지수에게 건넸다. "이걸로 약도 사고, 아이들 간식도 좀 사다 줘."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 고마운 마음으로 돈을 받았다. 어려운 시기였지만, 민호는 항상 가족을 먼저 생각했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"조심히 다녀오세요." 지수가 문간에서 남편을 배웅했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 고개를 끄덕이며 집을 나섰다. 새벽 공기는 차갑고 습했다. 바다에서 불어오는 바람이 그의 얼굴을 스쳐 지나갔다. 그는 익숙한 길을 따라 .</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 고마운 마음으로 돈을 받았다. 어려운 시기였지만, 민호는 항상 가족을 먼저 생각했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"조심히 다녀오세요." 지수가 문간에서 남편을 배웅했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 고개를 끄덕이며 집을 나섰다. 새벽 공기는 차갑고 습했다. 바다에서 불어오는 바람이 그의 얼굴을 스쳐 지나갔다. 그는 익숙한 길을 따라 .</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 고마운 마음으로 돈을 받았다. 어려운 시기였지만, 민호는 항상 가족을 먼저 생각했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"조심히 다녀오세요." 지수가 문간에서 남편을 배웅했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 고개를 끄덕이며 집을 나섰다. 새벽 공기는 차갑고 습했다. 바다에서 불어오는 바람이 그의 얼굴을 스쳐 지나갔다. 그는 익숙한 길을 따라 .</span></p>`;
  const halfLastPageContent = `<p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">1945년 해방 직후, 경상남도 통영의 작은 어촌 마을. 파도 소리가 끊임없이 들려오는 해안가에 오래된 목조 가옥 하나가 서 있었다. 이 집은 강 가문이 3대째 살아온 곳으로, 바다를 마주한 창문에서는 항상 소금기 섞인 바람이 들어왔다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">강민호는 그날 아침에도 여느 때와 다름없이 일찍 일어났다. 마흔 둘의 나이에도 그의 등허리는 여전히 곧았고, 손에는 어부의 거친 굳은살이 박혀 있었다. 그는 부엌에서 아내 윤지수가 아침 식사를 준비하는 소리를 들으며 현관문을 열었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"또 이렇게 일찍 나가시나요?" 지수가 부엌에서 소리쳤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 조용히 웃으며 대답했다. "바다는 기다려주지 않아. 오늘은 좋은 물고기가 많이 잡힐 것 같아."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 남편에게 따뜻한 차 한 잔을 건네주었다. 그녀의 얼굴에는 세월의 흔적이 조금씩 새겨지고 있었지만, 여전히 아름다웠다. 스물한 살에 결혼했으니 벌써 이십 년이 흘렀다. 그동안 세 아이를 낳고 키우며 바다와 싸우는 남편을 지켜봤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"오늘은 일찍 돌아오세요. 영호가 서울에서 편지를 보냈어요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호의 눈이 반짝였다. 큰아들 영호는 서울대학교에 진학해 공부하고 있었다. 가난한 어부의 아들이지만, 머리가 좋아 장학금을 받아 대학에 갈 수 있었다. 민호에게는 큰 자랑이었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"무슨 내용이던가?"</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"그건 돌아오시면 함께 읽어봐요. 아, 그리고 막내가 열이 좀 있는 것 같아요. 약을 사와야 할 것 같아요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 주머니를 뒤적이다가 몇 장의 지폐를 꺼내 지수에게 건넸다. "이걸로 약도 사고, 아이들 간식도 좀 사다 줘."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 고마운 마음으로 돈을 받았다. 어려운 시기였지만, 민호는 항상 가족을 먼저 생각했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"조심히 다녀오세요." 지수가 문간에서 남편을 배웅했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 고개를 끄덕이며 집을 나섰다. 새벽 공기는 차갑고 습했다. 바다에서 불어오는 바람이 그의 얼굴을 스쳐 지나갔다. 그는 익숙한 길을 따라 .</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"형님, 여기가 좋을 것 같습니다." 민석의 목소리에 민호는 생각에서 깨어났다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">그들은 그물을 던지기 시작했다. 날카로운 갈매기 소리와 함께, 하루의 일과가 시작되었다.1945년 해방 직후, 경상남도 통영의 작은 어촌 마을. 파도 소리가 끊임없이 들려오는 해안가에 오래된 목조 가옥 하나가 서 있었다. 이 집은 강 가문이 3대째 살아온 곳으로, 바다를 마주한 창문에서는 항상 소금기 섞인 바람이 들어왔다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">강민호는 그날 아침에도 여느 때와 다름없이 일찍 일어났다. 마흔 둘의 나이에도 그의 등허리는 여전히 곧았고, 손에는 어부의 거친 굳은살이 박혀 있었다. 그는 부엌에서 아내 윤지수가 아침 식사를 준비하는 소리를 들으며 현관문을 열었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"또 이렇게 일찍 나가시나요?" 지수가 부엌에서 소리쳤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 조용히 웃으며 대답했다. "바다는 기다려주지 않아. 오늘은 좋은 물고기가 많이 잡힐 것 같아."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 남편에게 따뜻한 차 한 잔을 건네주었다. 그녀의 얼굴에는 세월의 흔적이 조금씩 새겨지고 있었지만, 여전히 아름다웠다. 스물한 살에 결혼했으니 벌써 이십 년이 흘렀다. 그동안 세 아이를 낳고 키우며 바다와 싸우는 남편을 지켜봤다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"오늘은 일찍 돌아오세요. 영호가 서울에서 편지를 보냈어요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호의 눈이 반짝였다. 큰아들 영호는 서울대학교에 진학해 공부하고 있었다. 가난한 어부의 아들이지만, 머리가 좋아 장학금을 받아 대학에 갈 수 있었다. 민호에게는 큰 자랑이었다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"무슨 내용이던가?"</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"그건 돌아오시면 함께 읽어봐요. 아, 그리고 막내가 열이 좀 있는 것 같아요. 약을 사와야 할 것 같아요."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 주머니를 뒤적이다가 몇 장의 지폐를 꺼내 지수에게 건넸다. "이걸로 약도 사고, 아이들 간식도 좀 사다 줘."</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">지수는 고마운 마음으로 돈을 받았다. 어려운 시기였지만, 민호는 항상 가족을 먼저 생각했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"조심히 다녀오세요." 지수가 문간에서 남편을 배웅했다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">민호는 고개를 끄덕이며 집을 나섰다. 새벽 공기는 차갑고 습했다. 바다에서 불어오는 바람이 그의 얼굴을 스쳐 지나갔다. 그는 익숙한 길을 따라 .</span></p>`;

  return (
    <NodeContentWrapper tocNodeId={section.id} type="SECTION">
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>{section.title}</Typography>
      <LexicalComposer initialConfig={lexicalConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                outline: 'none',
                padding: '0',
              }}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <LexicalSettings section={section} />
        {/* <TreeViewPlugin /> */}
      </LexicalComposer>
    </NodeContentWrapper>
  );
};