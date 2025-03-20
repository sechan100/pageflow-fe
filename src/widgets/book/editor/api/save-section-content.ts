








// lexical에서 html 형식으로 직렬화한 section content type
export type LexicalHtmlSerializedState = string;


export const sectionContentSaveApi = async (sectionId: string, html: LexicalHtmlSerializedState): Promise<void> => {
  console.log('sectionContentSaveApi', sectionId, html);
}