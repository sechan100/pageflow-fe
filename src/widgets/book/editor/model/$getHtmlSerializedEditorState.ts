import { $generateHtmlFromNodes } from '@lexical/html';
import { $getEditor } from "lexical";
import { LexicalHtmlSerializedState } from "../api/save-content";



export const $getHtmlSerializedEditorState = (): LexicalHtmlSerializedState => {
  const editor = $getEditor();
  const htmlString = $generateHtmlFromNodes(editor, null);
  return htmlString;
} 