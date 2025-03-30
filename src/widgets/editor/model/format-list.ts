import { $isListItemNode, $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { $getEditor, $getSelection, $isRangeSelection, BaseSelection } from 'lexical';






const $getListType = (selection: BaseSelection): "ol" | "ul" | "not-list" => {
  for (const node of selection.getNodes()) {
    const itemNode = node.getParent();
    
    // 부모가 list item인지
    const isListItemNode = $isListItemNode(itemNode);
    if (!isListItemNode) continue;

    // 조부모가 list인지
    const listNode = itemNode.getParent();
    if ($isListNode(listNode)) {
      const tag = listNode.getTag();
      if (tag === "ol") return "ol";
      else if (tag === "ul") return "ul";
    }
  }
  return "not-list";
}

const $insertList = (listType: "ol" | "ul") => {
  const editor = $getEditor();
  if (listType === "ol") editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  else editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
}

export const $formatList = (listType: "ol" | "ul") => {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return false;
  const actualListType = $getListType(selection);
  if (actualListType === "not-list") {
    $insertList(listType);
  } else {
    if (actualListType !== listType) {
      $insertList(listType);
    } else {
      $getEditor().dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }
}