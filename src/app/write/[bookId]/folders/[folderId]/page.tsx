import { FolderEditPage } from "@/_pages/book/write/ui/FolderEditPage";
import { useNextRouter } from "@/shared/hooks/useNextRouter";







export default function Page() {
  const { params } = useNextRouter();

  if (!params.folderId || typeof params.folderId !== 'string') {
    throw new Error('folderId가 없습니다.');
  }
  const folderId = params.folderId;
  return (
    <>
      <FolderEditPage folderId={folderId} />
    </>
  )
}