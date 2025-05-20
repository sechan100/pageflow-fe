'use client';

import { WithAppbarLayout } from "@/global/layout/WithAppbarLayout";
import { BookListPage } from "@/pages/book-list";


export default function Home() {
  return (
    <WithAppbarLayout>
      <BookListPage />
    </WithAppbarLayout>
  );
}