'use client'
import { isReadableSectionContent, ReadableFolderContent, ReadableSectionContent } from "../../model/readable-content";
import { useReadingUnitStore } from "../../stores/reading-unit-store";
import { FolderContent } from "./FolderContent";
import { SectionContent } from "./SectionContent";


export const ReadingUnitExplorer = () => {
  const { readingUnitContent } = useReadingUnitStore();

  if (readingUnitContent === null) {
    return <div>Loading...</div>
  }
  return (
    <>
      {readingUnitContent.contents.map((content) => {
        if (isReadableSectionContent(content)) {
          return <SectionContent key={content.id} section={content as ReadableSectionContent} />
        } else {
          return <FolderContent key={content.id} folder={content as ReadableFolderContent} />
        }
      })}
    </>
  )
}