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
    save: (htmlContent: string) => {
      localStorage.setItem(sectionLocalStorageKey, htmlContent);
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
    },
    flush: async (): Promise<FlushResult> => {
      const html = localStorage.getItem(sectionLocalStorageKey);
      if(!html) return { result: "lastest" };
      const res = await mutateAsync({ html });
      if(res.success){
        localStorage.removeItem(sectionLocalStorageKey);
        return { result: "success" };
      } else {
        return { result: "error" };
      }
    }
  }
}