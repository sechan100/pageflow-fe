import { FolderDesign } from "@/entities/book";



export type ReadableFolderContent = {
  id: string;
  title: string;
  design: FolderDesign;
}

export type ReadableSectionContent = {
  id: string;
  title: string;
  shouldShowTitle: boolean;
  shouldBreakSection: boolean;
  content: string;
};

export type ReadableContent = ReadableFolderContent | ReadableSectionContent;

export const isReadableSectionContent = (content: ReadableContent): content is ReadableSectionContent => {
  return 'shouldShowTitle' in content && 'shouldBreakSection' in content && 'content' in content;
}

