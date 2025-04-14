'use client';

import { useCurrentNode } from '@/entities/editor';
import { SectionEditer } from '@/pages/write';


export default function Page() {
  const { nodeType, nodeId } = useCurrentNode();

  if (nodeId === null || nodeType !== 'section') {
    throw new Error('현재 노드가 section이 아닙니다.');
  }

  return (
    <>
      <SectionEditer sectionId={nodeId} />
    </>
  )
}