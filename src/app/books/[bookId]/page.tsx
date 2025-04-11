'use client';
import { BookInfoPage } from '@/pages/book';
import { useNextRouter } from '@/shared/hooks/useNextRouter';





export default function Page() {
  const { params } = useNextRouter();
  const { bookId } = params as { bookId: string };
  if (!bookId) {
    return <>book id not found</>
  }

  return (
    <BookInfoPage bookId={bookId} />
  );
}