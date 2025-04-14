'use client';
import { useCurrentNode } from '@/entities/editor';
import { FolderEditer } from '@/pages/write';



export default function Page() {
  const { nodeType, nodeId } = useCurrentNode();

  if (nodeId === null || nodeType !== 'folder') {
    throw new Error('현재 노드가 folder이 아닙니다.');
  }
  return (
    <>
      <FolderEditer folderId={nodeId} />
    </>
  )
}