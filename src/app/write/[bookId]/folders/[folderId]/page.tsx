'use client';
import { FolderEditer } from '@/pages/write';
import { useNextRouter } from "@/shared/hooks/useNextRouter";







export default function Page() {
  const { params } = useNextRouter();

  if (!params.folderId || typeof params.folderId !== 'string') {
    throw new Error('folderId가 없습니다.');
  }
  const folderId = params.folderId;
  return (
    <>
      <FolderEditer folderId={folderId} />
    </>
  )
}