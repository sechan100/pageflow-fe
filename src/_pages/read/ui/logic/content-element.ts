import { ReadableTocNodeType } from "@/entities/book";


export const SECTION_CONTENT_DATA_NODE_ID = "data-toc-section-id";
export const FOLDER_CONTENT_DATA_NODE_ID = "data-toc-folder-id";


type NodeInfo = {
  tocNodeId: string;
  tocNodeType: ReadableTocNodeType;
}
export const extractNodeInfoFromElement = (el: HTMLElement): NodeInfo => {
  const sectionId = el.dataset.tocSectionId;
  if (sectionId) {
    return { tocNodeId: sectionId, tocNodeType: "SECTION" }
  } else {
    const folderId = el.dataset.tocFolderId;
    if (folderId) {
      return { tocNodeId: folderId, tocNodeType: "FOLDER" }
    } else {
      throw new Error("No tocNodeId or tocFolderId found");
    }
  }
}