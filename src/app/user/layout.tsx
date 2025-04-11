'use client';
import { AuthGuard } from "@/global/layout/AuthGuard";
import { WithAppbarLayout } from "@/global/layout/WithAppbarLayout";
import React from "react";


export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <WithAppbarLayout>
        {children}
      </WithAppbarLayout>
    </AuthGuard>
  );
}
