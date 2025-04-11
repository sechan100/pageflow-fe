'use client';

import { WithAppbarLayout } from "@/global/layout/WithAppbarLayout";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WithAppbarLayout>
      {children}
    </WithAppbarLayout>
  );
}
