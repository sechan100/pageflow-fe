'use client'
import { SxProps } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getReadableFolderApi } from "../api/folder";
import { getReadableSectionApi } from "../api/section";
import { useBookContext } from "../model/book-context";
import { Position, usePositionStore } from "../model/position";
import { isReadableSectionContent, ReadableContent } from "../model/readable-content";
import { FolderContent } from "./FolderContent";
import { SectionContent } from "./SectionContent";


const contentCache = new Map<string, ReadableContent>();

const getContent = async (bookId: string, position: Position) => {
  const { tocNodeId, tocNodeType } = position;
  if (contentCache.has(tocNodeId)) {
    return contentCache.get(tocNodeId);
  }
  let content: ReadableContent;
  if (tocNodeType === "FOLDER") {
    content = await getReadableFolderApi({ bookId, folderId: tocNodeId });
  } else if (tocNodeType === "SECTION") {
    content = await getReadableSectionApi({ bookId, sectionId: tocNodeId });
  } else {
    throw new Error("Invalid tocNodeType");
  }
  contentCache.set(tocNodeId, content);
  return content;
}

type Props = {
  sx?: SxProps;
}
export const VirtualTocNodeLoader = ({
  sx
}: Props) => {
  const [contents, setContents] = useState<ReadableContent[]>([]);
  const { id: bookId } = useBookContext();
  const { prev, position, next } = usePositionStore();

  const updateContents = useCallback(async () => {
    const newContents = [
      prev ? await getContent(bookId, prev) : null,
      await getContent(bookId, position),
      next ? await getContent(bookId, next) : null
    ].filter((content) => content !== null) as ReadableContent[];

    setContents(newContents);
    console.log("Contents updated", newContents);
  }, [bookId, prev, position, next]);

  useEffect(() => {
    updateContents();
  }, [updateContents]);


  return (
    <>
      {contents.map((content) => {
        if (isReadableSectionContent(content)) {
          return <SectionContent key={content.id} section={content} />
        } else {
          return <FolderContent key={content.id} folder={content} />
        }
      })}
    </>
  )
}