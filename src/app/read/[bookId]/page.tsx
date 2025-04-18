'use client';

import { ReadPage } from '@/pages/read';
import { useNextRouter } from '@/shared/hooks/useNextRouter';

export default function BookReadPage() {
  const { params } = useNextRouter();
  const { bookId } = params as { bookId: string };
  if (!bookId) {
    return <div>책을 찾을 수 없습니다.</div>
  }

  return <ReadPage bookId={bookId} />;
}
