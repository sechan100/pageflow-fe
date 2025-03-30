'use client';

import { WritePageLayout } from '@/pages/write';
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { AuthGuard } from "../../_utils/AuthGuard";






type Props = {
  children: React.ReactNode
}
export default function Layout({ children }: Props) {
  const { params } = useNextRouter();

  if (!params.bookId || typeof params.bookId !== 'string') {
    throw new Error('bookId가 없습니다.');
  }
  const bookId = params.bookId;

  return (
    <AuthGuard>
      <WritePageLayout bookId={bookId}>
        {children}
      </WritePageLayout>
    </AuthGuard>
  )
}