import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import {
  $createParagraphNode, $getSelection, $isRangeSelection, BaseSelection
} from 'lexical';


// heading인지, 그리고 구체적으로 어떤 heading인지 확인해주는 함수
export const $isH = (selection: BaseSelection, headingSize: 'h1' | 'h2' | 'h3'): boolean => {
  const parent = selection.getNodes()[0].getParent();
  if (parent !== null) {
    return $isHeadingNode(parent) && parent.getTag() === headingSize;
  } else {
    return false;
  }
}

export const $formatHeading = (headingSize: "h1" | "h2" | "h3") => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {

    if ($isH(selection, headingSize)) {
      // 이미 heading인 경우 paragraph로 변환
      $setBlocksType(selection, () => {
        const nodes = selection.getNodes();
        const paragraphNode = $createParagraphNode();
        paragraphNode.append(...nodes);
        return paragraphNode;
      });
    } else {
      // 헤딩이 아닌 경우 헤딩으로 변환
      $setBlocksType(selection, () => $createHeadingNode(headingSize));
    }
  }
}