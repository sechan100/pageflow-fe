import { getReadableFolderContentApi } from "../api/folder";
import { getReadableSectionContentApi } from "../api/section";
import { ReadableContent, ReadableFolderContent, ReadableSectionContent } from "./readable-content";
import { ReadingUnit } from "./reading-unit";



export type ReadingUnitContent = {
  readingUnit: ReadingUnit;

  /**
   * headNode가 0에 위치, 이후 tailNode들이 이어진다.
   */
  contents: ReadableContent[];
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

const createReadingUnitContent = async (bookId: string, readingUnit: ReadingUnit): Promise<ReadingUnitContent> => {
  const headNode = readingUnit.headNode;
  const headNodeContent = headNode.type === "FOLDER" ? await loadFolder(bookId, headNode.id) : await loadSection(bookId, headNode.id);
  const contents = [headNodeContent];
  for (const tailNode of readingUnit.tailNodes) {
    const tailNodeContent = await loadSection(bookId, tailNode.id);
    contents.push(tailNodeContent);
  }
  return {
    readingUnit,
    contents,
  }
}

export const ReadingUnitContentLoader = {
  createReadingUnitContent,
}