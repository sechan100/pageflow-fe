'use client'
import { NodeTitleField } from '@/features/book'
import { useNotification } from '@/shared/notification'
import { SectionEditor as SectionEditorWidget, useSectionContent } from '@/widgets/book'
import { Box, SxProps } from "@mui/material"
import { useCallback } from 'react'
import { useSectionTitleMutation } from '../api/use-section-title-mutation'


// const htmlContent = `<p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서 들려왔다. 흰 머리의 노인이 천천히 나타났다. "특별한 책을 찾고 계신가요?"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 머뭇거렸다. "사실... 잘 모르겠어요. 그냥 끌려서 들어왔어요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">노인은 미소지었다. "가끔은 책이 독자를 찾아내기도 하죠." 그는 먼지 쌓인 책장으로 그녀를 인도했다. "이 책장의 책들은 특별해요. 읽는 사람에게 꼭 필요한 이야기를 들려주거든요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤의 손가락이 오래된 가죽 표지의 책에 닿았다. 제목은 희미했지만, 손끝에 전해지는 따뜻함은 분명했다. 책을 펼치자 첫 페이지에는 단 한 문장만이 적혀 있었다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"잊어버린 꿈을 찾아 떠나는 여행"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 고개를 들었을 때, 노인이 사라졌음을 알아챘다. 창밖으로는 이제 완전히 어두워진 밤하늘에 별들이 빛나고 있었다. 그 순간, 그녀는 오랫동안 잊고 있던 무언가를 다시 찾아야 한다는 생각이 마음속에 피어오르는 것을 느꼈다.저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서 들려왔다. 흰 머리의 노인이 천천히 나타났다. "특별한 책을 찾고 계신가요?"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 머뭇거렸다. "사실... 잘 모르겠어요. 그냥 끌려서 들어왔어요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">노인은 미소지었다. "가끔은 책이 독자를 찾아내기도 하죠." 그는 먼지 쌓인 책장으로 그녀를 인도했다. "이 책장의 책들은 특별해요. 읽는 사람에게 꼭 필요한 이야기를 들려주거든요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤의 손가락이 오래된 가죽 표지의 책에 닿았다. 제목은 희미했지만, 손끝에 전해지는 따뜻함은 분명했다. 책을 펼치자 첫 페이지에는 단 한 문장만이 적혀 있었다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"잊어버린 꿈을 찾아 떠나는 여행"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 고개를 들었을 때, 노인이 사라졌음을 알아챘다. 창밖으로는 이제 완전히 어두워진 밤하늘에 별들이 빛나고 있었다. 그 순간, 그녀는 오랫동안 잊고 있던 무언가를 다시 찾아야 한다는 생각이 마음속에 피어오르는 것을 느꼈다.저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소있던 무언가를 다시 찾아야 한다는 생각이 마음속에 피어오르는 것을 느꼈다.저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서 들려왔다. 흰 머리의 노인이 천천히 나타났다. "특별한 책을 찾고찾아야 한다는 생각이 마음속에 피어오르는 것을 느꼈다.저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼 계신가요?"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 머뭇거렸다.노인은 미소지었다. "가끔은 책이 독자를 찾아내기도 하죠." 그는 먼지 쌓인 책장으로 그녀를 인도했다. "이 책장의 책들은 특별해요. 읽는 사람에게 꼭 필요한 이야기를  "사실... 잘 모르겠어요. 그냥 끌려서 들어왔어요</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">노인은 미소지었다. "가끔은 책이 독자를 찾아내기도 하죠." 그는 먼지 쌓인 책장으로 그녀를 인도했다. "이 책장의 책들은 특별해요. 읽는 사람에게 꼭 필요한 이야기를 들려주거든요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤의 손가락이 오래된 가죽 표지의 책에 닿았다. 제목은 희미했지만, 손끝에 전해지는 따뜻함은 분명했다. 책을 펼치자 첫 페이지에는 단 한 문장만이 적혀 있었다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"잊어버린 꿈을 찾아 떠나는 여행"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 고개를 들었을 때, 노인이 사라졌음을 알아챘다. 창밖으로는 이제 완전히 어두워진 밤하늘에 별들이 빛나고 있었다. 그 순간, 그녀는 오랫동안 잊고 있던 무언가를 다시 찾아야 한다는 생각이 마음속에 피어오르는 것을 느꼈다.저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서 들려왔다. 흰 머리의 노인이 천천히 나타났다. "특별한 책을 찾고 계신가요?"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 머뭇거렸다. "사실... 잘 모르겠어요. 그냥 끌려서 들어왔어요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">노인은 미소지었다. "가끔은 책이 독자를 찾아내기도 하죠." 그는 먼지 쌓인 책장으로 그녀를 인도했다. "이 책장의 책들은 특별해요. 읽는 사람에게 꼭 필요한 이야기를 들려주거든요."</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤의 손가락이 오래된 가죽 표지의 책에 닿았다. 제목은 희미했지만, 손끝에 전해지는 따뜻함은 분명했다. 책을 펼치자 첫 페이지에는 단 한 문장만이 적혀 있었다.</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">"잊어버린 꿈을 찾아 떠나는 여행"</span>
// </p>
// <p class="pf-p" dir="ltr">
//   <span style="white-space: pre-wrap;">소윤은 고개를 들었을 때, 노인이 사라졌음을 알아챘다. 창밖으로는 이제 완전히 어두워진 밤하늘에 별들이 빛나고 있었다. 그 순간, 그녀는 오랫동안 잊고 있던 무언가를 다시 찾아야 한다는 생각이 마음속에 피어오르는 것을 느꼈다.</span>
// </p>`

// const htmlContent = `<p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">저녁의 그림자가 길게 늘어지던 때, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서 들려왔다. 흰 머리의 노인이 천천히 나타났다. "특별한 책을 찾고 계신가요?"</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">소윤은 머뭇거렸다. "사실... 잘 모르겠어요. 그냥 끌려서 들어왔어요."</span><img src="http://localhost:8888/public/files/2025/2/17/36548c65-45e8-4439-bb1f-e8dbfbcea886.jpeg" alt="출처: http://localhost:3000/write/2f701466-356f-48a4-b683-b769a95c70a1/sections/14a2b3af-141c-4ec4-abbc-5f3527dd294d" width="245" height="245" data-position="full" data-show-caption="true"><span style="white-space: pre-wrap;">, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서, 소윤은 오래된 책방 앞에 멈춰 섰다. 먼지 쌓인 창문 너머로 빛나는 노란 불빛이 그녀를 안으로 이끌었다. 문을 열자 종소리가 조용히 울렸고, 책 냄새가 그녀를 반겼다.</span></p><p class="pf-p" dir="ltr"><span style="white-space: pre-wrap;">"어서 오세요," 희미한 목소리가 책장 사이에서</span></p>`

type Props = {
  sectionId: string,
  sx?: SxProps
}
export const SectionEditer = ({
  sectionId,
  sx
}: Props) => {
  const { load } = useSectionContent(sectionId);
  const { mutateAsync } = useSectionTitleMutation(sectionId);
  const notification = useNotification();
  const { content, title, isLoading } = load();

  const saveTitle = useCallback(async (title: string) => {
    const res = await mutateAsync(title);
    if (res.success) {
      notification.success("제목을 변경했습니다.");
    } else {
      notification.error("제목 변경에 실패했습니다.");
    }
  }, [mutateAsync, notification]);


  if (content === undefined || isLoading) {
    return <div>loading...</div>
  }
  return (
    <Box sx={{
      px: 3,
      height: '90vh',
      overflowY: 'auto',
    }}>
      <Box
        sx={{
          mt: 5,
          mx: 8
        }}
      >
        <NodeTitleField
          title={title}
          onSave={saveTitle}
        />
      </Box>
      <SectionEditorWidget
        sectionId={sectionId}
        htmlContent={content}
      />
    </Box>
  )
}