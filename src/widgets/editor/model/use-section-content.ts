import { SectionWithContent, useSectionQuery } from "@/entities/book";
import { useSaveContentMutation } from "../api/save-content";
import { useSectionContentQuery } from "../api/section-content";



type SectionContentQueryResult = SectionWithContent & {
  isLoading: boolean;
}

type FlushResult = {
  result: "success" | "error" | "lastest";
}

export const useSectionContent = (sectionId: string) => {
  const sectionQuery = useSectionQuery(sectionId);
  const contentQuery = useSectionContentQuery(sectionId);
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
      if (!html) return { result: "lastest" };
      const res = await mutateAsync({ html });
      if (res.success) {
        localStorage.removeItem(sectionLocalStorageKey);
        return { result: "success" };
      } else {
        return { result: "error" };
      }
    },
    load: (): SectionContentQueryResult => {
      let content: string | null = null;

      const html = localStorage.getItem(sectionLocalStorageKey);
      if (html !== null) {
        content = html;
      } else {
        content = contentQuery.data?.content || "";
      }

      return {
        id: sectionId,
        title: sectionQuery.data?.title || "",
        content: content || "",
        isLoading: sectionQuery.isLoading || contentQuery.isLoading,
      }
    }
  }
}