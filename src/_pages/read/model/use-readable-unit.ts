import { ReadableTocFolder } from "@/entities/book";
import { useCallback } from "react";
import { create } from "zustand";
import { getReadableFolderContentApi } from "../api/folder";
import { getReadableSectionContentApi } from "../api/section";
import { useBookContext } from "./book-context";
import { ReadableFolderContent, ReadableSectionContent } from "./readable-content";
import { useTocContext } from "./toc-context";
import { TocUtils } from "./toc-utils";


type ReadableUnitStore = {
  // unit의 대가리가 되는 Folder 노드.
  leadFolder: ReadableTocFolder;
  folder: ReadableFolderContent;
  sections: ReadableSectionContent[];

  /**
   * sections는 page가 넘어감에 따라서 lazy loading 된다.
   * 이 때, sections는 두가지 경우 모두 채워진 것으로 간주되며 isFullyLoaded가 true로 변경된다.
   * 1. leaderFolder의 children을 모두 채운 경우
   * 2. 다음 채울 child node가 folder인 경우
   *  이 경우는 더이상 섹션을 로드할 수 없으므로 채울 수 있는 섹션을 모두 채운 것으로 간주되고
   *  isFullyLoaded가 true로 변경된다.
   */
  isFullyLoaded: boolean;
}
const useReadableUnitStore = create<ReadableUnitStore>(() => ({
  leadFolder: {
    id: "",
    type: "FOLDER",
    title: "",
    children: [],
  },
  folder: {
    id: "",
    design: "DEFAULT",
    title: "",
  },
  sections: [],
  isFullyLoaded: true,
}));

const folderCache = new Map<string, ReadableFolderContent>();
const sectionCache = new Map<string, ReadableSectionContent>();

export const useReadableUnit = () => {
  const { id: bookId } = useBookContext();
  const toc = useTocContext();
  const { leadFolder, folder, sections, isFullyLoaded } = useReadableUnitStore();


  const loadFolder = useCallback(async (folderId: string) => {
    if (folderCache.has(folderId)) {
      return folderCache.get(folderId) as ReadableFolderContent;
    }
    const loaded = await getReadableFolderContentApi({ bookId, folderId });
    folderCache.set(folderId, loaded);
    return loaded;
  }, [bookId]);


  const loadSection = useCallback(async (sectionId: string) => {
    if (sectionCache.has(sectionId)) {
      return sectionCache.get(sectionId) as ReadableSectionContent;
    }
    const loaded = await getReadableSectionContentApi({ bookId, sectionId });
    sectionCache.set(sectionId, loaded);
    return loaded;
  }, [bookId]);


  /**
   * 새로운 Folder를 ReadableUnit의 leaderFolder로 설정한다.
   */
  const setLeadFolder = useCallback(async (folderId: string) => {
    const newLeaderFolder = TocUtils.findFolder(toc, folderId);

    return useReadableUnitStore.setState({
      leadFolder: newLeaderFolder,
      folder: await loadFolder(newLeaderFolder.id),
      sections: [],
      isFullyLoaded: false,
    });
  }, [loadFolder, toc]);


  /**
   * section의 lazy 로딩을 위한 api.
   * 가장 마지막에 추가로 섹션을 로드한다.
   * isFullyLoaded가 true인 경우는 더이상 섹션을 로드할 수 없으므로 아무런 작업도 하지 않는다.
   */
  const fetchNextSection = useCallback(async () => {
    const { children } = leadFolder;
    if (isFullyLoaded) {
      return;
    }
    const nextSectionInfo = children[sections.length];
    // 다음 로드할 노드가 section이 아닌 경우 채우지 않는다.
    if (nextSectionInfo.type !== "SECTION") {
      useReadableUnitStore.setState({
        isFullyLoaded: true,
      });
      return;
    }
    const nextSection = await loadSection(nextSectionInfo.id);
    const newSections = [...sections, nextSection];
    if (newSections.length === children.length) {
      useReadableUnitStore.setState({
        isFullyLoaded: true,
        sections: newSections,
      });
    } else {
      useReadableUnitStore.setState({
        sections: newSections,
      });
    }
  }, [isFullyLoaded, leadFolder, loadSection, sections]);


  return {
    leadFolder,
    folder,
    sections,
    isFullyLoaded,
    setLeadFolder,
    fetchNextSection,
  };
}