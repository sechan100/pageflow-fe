import { useSaveContentMutation } from "../api/save-content";
import { useEditorSectionContentQuery } from "../api/use-editor-section-content-query";



type SectionContentQueryResult = {
  content: string;
  isLoading: boolean;
}

type FlushResult = {
  result: "success" | "error" | "lastest";
}

export const useSectionContentRepository = (sectionId: string) => {
  const query = useEditorSectionContentQuery(sectionId);
  const { mutateAsync } = useSaveContentMutation(sectionId);
  const sectionLocalStorageKey = `section-${sectionId}`;

  return {
    /**
     * 해당 함수를 호출하고 일정시간이 지나면 자동으로 서버와 내용을 동기화한다.
     */
    save: (htmlContent: string) => {
      localStorage.setItem(sectionLocalStorageKey, htmlContent);
    },
    sync: async (): Promise<FlushResult> => {
      const html = localStorage.getItem(sectionLocalStorageKey);
      if(!html) return { result: "lastest" };
      const res = await mutateAsync({ html });
      if(res.success){
        localStorage.removeItem(sectionLocalStorageKey);
        return { result: "success" };
      } else {
        return { result: "error" };
      }
    },
    load: () => {
      const html = localStorage.getItem(sectionLocalStorageKey);
      if(html){
        return {
          content: html,
          isLoading: false
        }
      } else {
        return {
          content: query.data?.content || "",
          isLoading: query.isLoading
        }
      }
    }
  }
}