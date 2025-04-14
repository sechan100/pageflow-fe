import { WithContentEditorSection, useEditorSectionQuery } from "@/entities/editor";
import { useSaveContentMutation } from "../api/save-content";
import { useEditorSectionContentQuery } from "../api/section-content";



type SectionContentQueryResult = {
  section: WithContentEditorSection | null;
  isLoading: boolean;
}

type FlushResult = {
  result: "success" | "error" | "lastest";
}

export const useSectionContent = (bookId: string, sectionId: string) => {
  const sectionQuery = useEditorSectionQuery(bookId, sectionId);
  const contentQuery = useEditorSectionContentQuery(bookId, sectionId);
  const { mutateAsync } = useSaveContentMutation(bookId, sectionId);
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
      const isLoading = sectionQuery.isLoading || contentQuery.isLoading;
      let content: string | null = null;
      let title: string | null = null;

      const html = localStorage.getItem(sectionLocalStorageKey);
      if (html !== null) {
        content = html;
      } else {
        if (!isLoading && contentQuery.data !== undefined) {
          content = contentQuery.data.content;
        }
      }

      if (!isLoading && sectionQuery.data !== undefined) {
        title = sectionQuery.data.title;
      }

      return {
        isLoading,
        section: (!isLoading && content !== null && title !== null) ? {
          id: sectionId,
          title: title,
          content: content,
        } : null
      }
    }
  }
}