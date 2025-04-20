'use client'
import { useReadableFolderQuery } from "../../api/folder";
import { useBookContext } from "../../model/book-context";
import { usePositionStore } from "../../model/position";
import { FolderReader } from "./FolderReader";


export const FolderDataProvider = () => {
  const bookId = useBookContext().id;
  const position = usePositionStore(s => s.position);
  const { data, isLoading, promise } = useReadableFolderQuery({ bookId, folderId: position.tocNodeId });
  if (isLoading || data === undefined) {
    return <div>폴더 로딩중...</div>
  }

  return (
    <FolderReader
      folder={data}
    />
  )
}