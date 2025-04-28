import { isReadableTocFolder, ReadableToc, ReadableTocFolder, ReadableTocNode, ReadableTocSection } from "@/entities/book";
import { useCallback } from "react";
import { create } from "zustand";
import { getReadableFolderContentApi } from "../api/folder";
import { getReadableSectionContentApi } from "../api/section";
import { useBookContext } from "./context/book-context";
import { ReadableContent, ReadableFolderContent, ReadableSectionContent } from "./readable-content";
import { TocOperations } from "./toc-utils";
import { useTocContext } from "./context/toc-context";

/**
 * reader가 연속적으로 읽을 수 있는 단위.
 * leadNode를 시작으로하여 페이지를 넘기며 볼 수 있는 곳까지를 연속적으로 볼 수 있는 단위이다.
 * 다음 node가 연속적인 페이지로 구성할 수 없다면, 이를 leadNode로 지정하고 새로운 unit이 시작된다.
 * 
 * unit이 "페이지를 넘기며 볼 수 있는 곳까지를 연속적으로 볼 수 있는" node들을 모두 로드했고, 이 다음부터는 unit이 새롭게 시작되어야함을 isUnitEnd로 나타낸다.
 */
type ReadableUnit = {
  /**
   * unit의 대가리 시작지점.
   * leadNode는 toc의 계층 구조에 따라 정해지므로, 같은 구조인 toc에서 언제나 leadNode들은 동일하다.
   */
  leadNode: ReadableTocNode;

  // leadNode의 content. Folder일지 Section일지 모른다.
  leadNodeContent: ReadableContent;

  /**
   * leadNode 이후에는 section들만 연속적으로 읽어나갈 수 있다.
   * 단, 한번에 모든 section들을 로드하지 않고, 이후 page가 넘어감에 따라 천천히 로드해올 수 있다.
   */
  sections: ReadableSectionContent[];

  /**
   * sections가 lazy loading될 때, 로드된 node가 section이 아니라 folder인 경우, 
   * 그 즉시 unit에 로드할 수 있는 모든 section을 로드한 것으로 판단하고 로드된 node를 포함하지 않은 상태로 isUnitEnd가 true로 변경된다.
   */
  isUnitEnd: boolean;
}
const useReadableUnitStore = create<ReadableUnit>(() => ({
  leadNode: {
    id: "",
    type: "FOLDER",
    title: "",
    children: [],
  },
  leadNodeContent: {
    id: "",
    design: "DEFAULT",
    title: "",
  },
  sections: [],
  isUnitEnd: true,
}));

const folderCache = new Map<string, ReadableFolderContent>();
const sectionCache = new Map<string, ReadableSectionContent>();

/**
 * 해당 노드가 leadNode인지 확인한다.
 * 1. 모든 Folder는 leadNode다.
 * 2. Section인 경우, 바로 앞의 node가 Folder라면 해당 Section은 leadNode다.
 *   그 반대로, 바로 앞이 없거나 Section이라면 그 node는 leadNode가 아니다.
 *   단, node의 부모가 root folder인 경우에 node의 바로 앞이 없다면 그 node는 leadNode다.
 */
const isLeadNode = (toc: ReadableToc, targetId: string) => {
  const parent = TocOperations.findParent(toc, targetId);
  const target = TocOperations.findNode(toc, targetId);
  // 1. node가 folder인 경우 반드시 leadNode이다.
  if (target.type === "FOLDER") {
    return true;
  }
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

/**
 * currentLeadNode의 prevLeadNode를 찾는다.
 */
const findPrevLeadNode = (toc: ReadableToc, currentLeadNodeId: string): ReadableTocNode | null => {
  if (!isLeadNode(toc, currentLeadNodeId)) {
    throw new Error(`currentLeadNode가 leadNode가 아닙니다. ${currentLeadNodeId}`);
  }
  const parent = TocOperations.findParent(toc, currentLeadNodeId);
  const currentLeadNode = TocOperations.findNode(toc, currentLeadNodeId);
  const currentLeadNodeIndex = parent.children.indexOf(currentLeadNode);

  // currentLeadNode가 toc의 제일 처음 leadNode인 경우를 확인
  if (TocOperations.isRootFolder(toc, parent.id) && currentLeadNodeIndex === 0) {
    return null;
  }

  /**
   * 일단 currentLeadNode의 형제 중에서 바로 앞에 있는 다른 leadNode를 찾는다.
   * 그 leadNode가 Section이라면 바로 반환, Folder라면 그 Folder를 기준으로 가장 오른쪽으로 끝까지 간 node, 그 node의 leadNode가 바로 정답
   */
  let prevLeadNodeAmongSiblings: ReadableTocNode | null = null;
  for (let i = currentLeadNodeIndex - 1; i >= 0; i--) {
    const candidate = parent.children[i];
    if (isLeadNode(toc, candidate.id)) {
      prevLeadNodeAmongSiblings = candidate;
      break;
    }
  }
  // currentLeadNodeIndex부터 children[0]까지 돌았는데 leadNode를 찾지 못한 경우는 parent가 정답이다.
  if (prevLeadNodeAmongSiblings === null) {
    return parent;
  }

  if (prevLeadNodeAmongSiblings.type === "SECTION") {
    return prevLeadNodeAmongSiblings;
  }

  // currentLeadNode의 바로 앞에 있는 prevLeadNode를 기준으로 rightmost path로 움직여 도달한 node
  const prevRightMostNode = TocOperations.findRightMostNode(prevLeadNodeAmongSiblings as ReadableTocFolder);
  const leadNodeOfPrevRightMostNode = resolveLeadNode(toc, prevRightMostNode.id);
  return leadNodeOfPrevRightMostNode;
}

/**
 * currentLeadNode의 다음 leadNode를 찾는다.
 */
const findNextLeadNode = (toc: ReadableToc, currentLeadNodeId: string): ReadableTocNode | null => {
  if (!isLeadNode(toc, currentLeadNodeId)) {
    throw new Error(`currentLeadNode가 leadNode가 아닙니다. ${currentLeadNodeId}`);
  }
  return findNextLeadNodeRecursive(toc, currentLeadNodeId);
}

const findNextLeadNodeRecursive = (toc: ReadableToc, currentLeadNodeId: string): ReadableTocNode | null => {
  const next = findNextNodeRecursive(toc, currentLeadNodeId, false);
  if (next === null) {
    return null;
  }
  if (isLeadNode(toc, next.id)) {
    return next;
  } else {
    return findNextLeadNodeRecursive(toc, next.id);
  }
}

const findNextNodeRecursive = (toc: ReadableToc, currentNodeId: string, isFromBottom: boolean): ReadableTocNode | null => {
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
    return findNextNodeRecursive(toc, parent.id, true);
  }
}

/**
 * unit을 검증하여 이 다음 section을 채울 수 있는지 확인한다.
 */
const validateCanFillNextNode = ({ leadNode, isUnitEnd, sections }: ReadableUnit, toc: ReadableToc): boolean => {
  if (isUnitEnd) {
    return false;
  }
  // leadNode가 Folder인 경우
  if (isReadableTocFolder(leadNode)) {
    let nextNode: ReadableTocNode;
    // leadNodeFolder의 자식 중, 아직 로드하지 않은 자식이 있다면 nextNode로 지정. leadFolder의 모든 자식이 채워졌다면 unit이 끝난 것.
    if (sections.length <= leadNode.children.length - 1) {
      nextNode = leadNode.children[sections.length];
    } else {
      return false;
    }
    // 다음 가져올 node가 Folder라면 unit이 끝난 것
    if (nextNode.type === "FOLDER") {
      return false;
    }
  }
  // leadNode가 Section인 경우
  else {
    const leadNodeParent = TocOperations.findParent(toc, leadNode.id);
    const leadNodeIndex = leadNodeParent.children.indexOf(leadNode);
    const nextIndex = leadNodeIndex + 1;
    let nextNode: ReadableTocNode;
    if (nextIndex <= leadNodeParent.children.length - 1) {
      nextNode = leadNodeParent.children[nextIndex];
    } else {
      return false;
    }

    // 다음 가져올 node가 Folder라면 unit이 끝난 것
    if (nextNode.type === "FOLDER") {
      return false;
    }
  }

  return true;
}

/**
 * 제공된 nodeId가 속하는 unit의 leadNode를 찾는다.
 */
export const resolveLeadNode = (toc: ReadableToc, targetId: string) => {
  // target이 leadNode가 아닌 경우, target은 반드시 readableUnit의 중간에 속하는 Section이므로, 앞 node로 이동하다보면 leadNode를 발견할 수 밖에 없다.
  const parent = TocOperations.findParent(toc, targetId);
  const target = TocOperations.findNode(toc, targetId);
  const targetIndex = parent.children.indexOf(target);
  for (let i = targetIndex; i >= 0; i--) {
    const node = parent.children[i];
    if (isLeadNode(toc, node.id)) {
      return node;
    }
  }
  /**
   * parent의 children[0]까지 돌았는데 leadNode를 찾지 못한 경우, parent가 leadNode이다.
   * 한편, parent가 root인 경우 isLeadNode 함수가 0번째 section을 leadNode로 판단하기 때문에 parent는 절대 root folder가 아니다.
   */
  return parent;
}

/**
 * 다음 채워야할 section의 id를 가져온다.
 */
const findNextSectionId = (leadNode: ReadableTocNode, sections: ReadableSectionContent[], toc: ReadableToc): string => {
  let parent: ReadableTocFolder;
  let nextIndex: number;
  // leadNode가 Folder
  if (isReadableTocFolder(leadNode)) {
    parent = leadNode;
    nextIndex = sections.length;
  }
  // leadNode가 Section
  else {
    parent = TocOperations.findParent(toc, leadNode.id);
    nextIndex = parent.children.indexOf(leadNode) + 1;
  }

  if (nextIndex > parent.children.length - 1) {
    throw new Error("다음 section을 가져올 수 없습니다 IndexOutOfRange. 이런 경우 isUnitEnd가 이전 fill 호출에서 true로 세팅돼야 했습니다. validateCanFillNextNode를 확인하세요.");
  }

  const nextNode = parent.children[nextIndex];
  if (nextNode.type !== "SECTION") {
    throw new Error("다음 로드한 node가 Section이 아닙니다. 이런 경우 isUnitEnd가 이전 fill 호출에서 true로 세팅돼야 했습니다. validateCanFillNextNode를 확인하세요.")
  }

  return nextNode.id;
}

export const useReadableUnit = () => {
  const { id: bookId } = useBookContext();
  const toc = useTocContext();
  const { leadNode, leadNodeContent, sections, isUnitEnd } = useReadableUnitStore();

  /**
   * 캐시에서 폴더를 가져오거나, api를 호출하여 가져오고 캐싱한다.
   */
  const loadFolder = useCallback(async (folderId: string) => {
    if (folderCache.has(folderId)) {
      return folderCache.get(folderId) as ReadableFolderContent;
    }
    const loaded = await getReadableFolderContentApi({ bookId, folderId });
    folderCache.set(folderId, loaded);
    return loaded;
  }, [bookId]);

  /**
   * 캐시에서 section을 가져오거나, api를 호출하여 가져오고 캐싱한다.
   */
  const loadSection = useCallback(async (sectionId: string) => {
    if (sectionCache.has(sectionId)) {
      return sectionCache.get(sectionId) as ReadableSectionContent;
    }
    const loaded = await getReadableSectionContentApi({ bookId, sectionId });
    sectionCache.set(sectionId, loaded);
    return loaded;
  }, [bookId]);

  const setLeadNode = useCallback(async (newLeadNode: ReadableTocNode, withFullSections: boolean = false) => {
    const newUnit: ReadableUnit = {
      leadNode: newLeadNode,
      leadNodeContent: newLeadNode.type === "FOLDER" ? await loadFolder(newLeadNode.id) : await loadSection(newLeadNode.id),
      sections: [],
      isUnitEnd: false,
    }
    newUnit.isUnitEnd = !validateCanFillNextNode(newUnit, toc);
    if (withFullSections) {
      while (newUnit.isUnitEnd === false) {
        const nextId = findNextSectionId(newLeadNode, newUnit.sections, toc);
        newUnit.sections.push(await loadSection(nextId));
        newUnit.isUnitEnd = !validateCanFillNextNode(newUnit, toc);
      }
    }
    useReadableUnitStore.setState(newUnit);
  }, [loadFolder, loadSection, toc]);

  /**
   * section의 lazy 로딩을 위한 api.
   * 가장 마지막에 추가로 섹션을 로드한다.
   * isUnitEnd가 true인 경우는 더이상 섹션을 로드할 수 없으므로 에러
   */
  const fillNextSection = useCallback(async () => {
    if (isUnitEnd) {
      throw new Error("다음 섹션을 로드할 수 없습니다.")
    }
    const nextSectionId = findNextSectionId(leadNode, sections, toc);
    const nextSection = await loadSection(nextSectionId);
    const newUnit: ReadableUnit = {
      isUnitEnd,
      leadNode,
      leadNodeContent,
      sections: [...sections, nextSection]
    }
    const isNewUnitEnd = !validateCanFillNextNode(newUnit, toc);
    useReadableUnitStore.setState({
      ...newUnit,
      isUnitEnd: isNewUnitEnd
    })
  }, [isUnitEnd, leadNode, leadNodeContent, loadSection, sections, toc]);

  /**
   * 현재 leadNode를 기준으로 이전, 또는 다음 leadNode로 이동한다.
   * 만약 현재 leadNode가 toc에서 가장 앞, 혹은 뒤에 있는 leadNode인 경우 아무런 동작도 하지 않는다.
   * TODO: 나중에 마지막인 경우를 미리 확인해서 flag로 걸어줘야 ui에서 옆으로 못 넘어가게함.
   * 
   * @returns 실제로 이동을 했는지 여부 (양 끝이라면 이동을 못함.)
   */
  const moveLeadNode = useCallback((direction: "prev" | "next") => {
    let moved: ReadableTocNode | null = null;
    let fillFullSection = false;
    if (direction === "prev") {
      moved = findPrevLeadNode(toc, leadNode.id);
      fillFullSection = true;
    } else {
      moved = findNextLeadNode(toc, leadNode.id);
      fillFullSection = false;
    }

    if (moved !== null) {
      setLeadNode(moved, fillFullSection);
      return moved;
    } else {
      console.debug("더 이상 (이전/다음)으로 이동할 수 없습니다.");
      return null;
    }
  }, [leadNode.id, setLeadNode, toc]);

  return {
    leadNode,
    leadNodeContent,
    sections,
    isUnitEnd,
    fillNextSection,
    moveLeadNode,
    setLeadNode,
  };
}