import { isReadableTocFolder, ReadableToc, ReadableTocNode, ReadableTocSection } from "@/entities/book";
import { TocOperations } from "./toc-operations";


/**
 * reader가 연속적으로 읽을 수 있는 node들의 묶음이다.
 * headNode를 시작으로하여 페이지를 넘기며 볼 수 있는 곳까지를 연속적으로 볼 수 있는 단위이다.
 * 다음 node가 연속적인 페이지로 구성할 수 없다면, 이를 headNode로 지정하고 새로운 unit이 시작된다.
 */

export type ReadingUnit = {
  /**
   * unit의 대가리
   * 같은 구조인 toc에서 headNode들은 정해져있고, 계층구조가 변경되지 않는 이상 달라지지 않는다.
   */
  headNode: ReadableTocNode;

  /**
   * headNode를 포함하여 연속적으로 읽을 수 있는 node들
   * Section만 tailNode가 될 수 있다.
   */
  tailNodes: ReadableTocSection[];
};

/**
 * 어떤 Toc를 분석하여 만들어낸 ReadingUnit의 순서데이터.
 * 해당 순서대로 책을 읽어나갈 수 있다.
 */
export type ReadingUnitSequence = ReadingUnit[];

/**
 * 해당 노드가 headNode인지 확인한다.
 * 1. 모든 Folder는 headNode다.
 * 2. Section인 경우, 바로 앞의 node가 Folder라면 해당 Section은 headNode다.
 *   그 반대로, 바로 앞이 없거나 Section이라면 그 node는 headNode가 아니다.
 *   단, node의 부모가 root folder인 경우에 node의 바로 앞이 없다면 그 node는 headNode다.
 */
const isHeadNode = (targetId: string, toc: ReadableToc) => {
  const target = TocOperations.findNode(toc, targetId);
  // node가 folder인 경우 headNode이다.
  if (target.type === "FOLDER") {
    return true;
  }
  // target이 section인 경우.
  const parent = TocOperations.findParent(toc, targetId);
  const section = target as ReadableTocSection;
  const sectionIndex = parent.children.indexOf(section);

  if (sectionIndex === 0) {
    /**
     * children에서 가장 앞에 있는 section일 때, 부모가 rootFolder라면 section은 leadNode가 된다.
     * 부모노드가 일반적인 Folder일 때는 X
     */
    if (TocOperations.isRootFolder(toc, parent.id)) {
      return true;
    } else {
      return false;
    }
  }
  // 2. Section의 바로 앞 node가 같은 Section이라면 해당 Section은 leadNode가 아니다.
  if (parent.children[sectionIndex - 1].type === "SECTION") {
    return false;
  }

  return true;
}

const findNextNodeRecursive = (currentNodeId: string, toc: ReadableToc, isFromBottom: boolean): ReadableTocNode | null => {
  const target = TocOperations.findNode(toc, currentNodeId);
  if (isReadableTocFolder(target) && !isFromBottom) {
    if (target.children.length === 0) {
      return null;
    } else {
      return target.children[0];
    }
  }
  else {
    const parent = TocOperations.findParent(toc, currentNodeId);
    const targetIndex = parent.children.indexOf(target);
    const nextIndex = targetIndex + 1;
    if (nextIndex <= parent.children.length - 1) {
      return parent.children[nextIndex];
    }
    if (TocOperations.isRootFolder(toc, parent.id)) {
      return null;
    }
    return findNextNodeRecursive(parent.id, toc, true);
  }
}

const buildReadingUnit = (headNode: ReadableTocNode, toc: ReadableToc): ReadingUnit => {
  const tailNodes: ReadableTocSection[] = [];

  let lastNode: ReadableTocNode | null = headNode;
  while (true) {
    const nextNode = findNextNodeRecursive(lastNode.id, toc, false);
    if (!nextNode) {
      break;
    }
    // headNode 이후에, 다음 headNode는 반드시 Folder이기 때문에, Section이라면 바로 tailNode로 추가
    if (!isHeadNode(nextNode.id, toc)) {
      tailNodes.push(nextNode as ReadableTocSection);
      lastNode = nextNode;
    } else {
      break;
    }
  }

  return {
    headNode: headNode,
    tailNodes: tailNodes,
  }
}

const createReadingUnitSequence = (toc: ReadableToc): ReadingUnitSequence => {
  const sequence: ReadingUnitSequence = [];

  /**
   * 시작 노드를 찾는다.
   * root의 0번째 child는 Section이던, Folder이던 HeadNode이다.
   */
  const root = toc.root;
  const firstHeadNode = root.children[0];
  if (!firstHeadNode) {
    throw new Error("Toc에 child가 없습니다.");
  }


  let headNode: ReadableTocNode | null = firstHeadNode;
  while (headNode !== null) {
    const nextUnit = buildReadingUnit(headNode, toc);
    sequence.push(nextUnit);
    const nextUnitLastNode = nextUnit.tailNodes.length > 0 ? nextUnit.tailNodes[nextUnit.tailNodes.length - 1] : headNode;
    headNode = findNextNodeRecursive(nextUnitLastNode.id, toc, false);
  }

  return sequence;
}

/**
 * nodeId에 해당하는 node를 포함하고있는 unit을 찾아서 반환한다
 * 찾지 못한 경우 null을 반환
 */
const findUnitContainingNode = (nodeId: string, sequence: ReadingUnitSequence): ReadingUnit | null => {
  for (const unit of sequence) {
    if (unit.headNode.id === nodeId) {
      return unit;
    }
    for (const tailNode of unit.tailNodes) {
      if (tailNode.id === nodeId) {
        return unit;
      }
    }
  }
  return null;
}


export const ReadingUnitService = {
  createReadingUnitSequence,
  findUnitContainingNode,
}