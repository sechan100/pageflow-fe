import { $generateHtmlFromNodes } from '@lexical/html';
import { $getEditor } from "lexical";

// lexical에서 html 형식으로 직렬화한 section content type
export type LexicalHtmlSerializedState = string;

export const $getHtmlSerializedEditorState = (): LexicalHtmlSerializedState => {
  const editor = $getEditor();
  const htmlString = $generateHtmlFromNodes(editor, null);
  return htmlString;
}

