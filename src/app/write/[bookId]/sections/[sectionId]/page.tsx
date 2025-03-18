'use client';

import { SectionEditPage } from '@/pages/book';
import { useNextRouter } from "@/shared/hooks/useNextRouter";







export default function Page() {
  const { params } = useNextRouter();

  if (!params.sectionId || typeof params.sectionId !== 'string') {
    throw new Error('sectionId가 없습니다.');
  }
  const sectionId = params.sectionId;
  return (
    <>
      <SectionEditPage sectionId={sectionId} />
    </>
  )
}