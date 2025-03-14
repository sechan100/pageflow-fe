'use client';
import { WritePage } from "@/_pages/book";
import { useNextRouter } from "@/shared/hooks/useNextRouter";





export default function Page() {
  const { params } = useNextRouter();

  if (!params.bookId || typeof params.bookId !== 'string') {
    throw new Error('bookId가 없습니다.');
  }
  const bookId = params.bookId;
  return (
    <>
      <WritePage bookId={bookId} />
    </>
  )
}