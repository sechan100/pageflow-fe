import { getReadableFolderContentApi } from "../api/folder";
import { getReadableSectionContentApi } from "../api/section";
import { ReadableContent, ReadableFolderContent, ReadableSectionContent } from "./readable-content";
import { ReadingUnit } from "./reading-unit";



export type ReadingUnitContent = {
  readingUnit: ReadingUnit;

  /**
   * headNode가 반드시 0에 위치한다.
   * length가 0인 경우는 없다.
   * lazy loading될 수 있기 때문에 항상 모든 unit content가 로드되어있음을 보장하지는 않는다.
   */
  contents: ReadableContent[];

  /**
   * contents가 lazy loading될 때, 완전히 모두 로드된 것인지 판단하기 위한 플래그.
   * 아직 추가로 로드해야하는 content가 있다면 false
   */
  isUnitEnd: boolean;
}

const folderCache = new Map<string, ReadableFolderContent>();
const sectionCache = new Map<string, ReadableSectionContent>();

const loadFolder = async (bookId: string, folderId: string) => {
  if (folderCache.has(folderId)) {
    return folderCache.get(folderId) as ReadableFolderContent;
  }
  const loaded = await getReadableFolderContentApi({ bookId, folderId });
  folderCache.set(folderId, loaded);
  return loaded;
}

const loadSection = async (bookId: string, sectionId: string) => {
  if (sectionCache.has(sectionId)) {
    return sectionCache.get(sectionId) as ReadableSectionContent;
  }
  const loaded = await getReadableSectionContentApi({ bookId, sectionId });
  sectionCache.set(sectionId, loaded);
  return loaded;
}

/**
 * unit의 contents가 모두 로드되었는지 확인함
 */
const isUnitContentFullyLoaded = (readingUnit: ReadingUnit, contents: ReadableContent[]) => {
  return contents.length - 1 === readingUnit.tailNodes.length;
}

/**
 * 다음 content를 하나 더 로드한다.
 * 만약 이미 unit이 모두 로드되었다면 그대로 반환한다.
 */
const loadNextContent = async (bookId: string, unitContent: ReadingUnitContent) => {
  const { readingUnit, contents, isUnitEnd } = unitContent;
  if (isUnitEnd) {
    return unitContent;
  }

  // contents의 0번은 언제나 headNode이고, 이후로는 tailNodes와 동일하기에 1을 빼줌
  const nextContentIndex = contents.length - 1;
  const nextContentNode = readingUnit.tailNodes[nextContentIndex];
  const nextContent = await loadSection(bookId, nextContentNode.id);
  const newContents = [...contents, nextContent];
  return {
    readingUnit,
    contents: newContents,
    isUnitEnd: isUnitContentFullyLoaded(readingUnit, newContents),
  }
}

const createReadingUnitContent = async (bookId: string, readingUnit: ReadingUnit): Promise<ReadingUnitContent> => {
  const headNode = readingUnit.headNode;
  const headNodeContent = headNode.type === "FOLDER" ? await loadFolder(bookId, headNode.id) : await loadSection(bookId, headNode.id);
  const contents = [headNodeContent];
  return {
    readingUnit,
    contents,
    isUnitEnd: isUnitContentFullyLoaded(readingUnit, contents),
  }
}

export const ReadingUnitContentLoader = {
  createReadingUnitContent,
  loadNextContent,
}