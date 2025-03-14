'use client';
import React from "react";
import { AuthGuard } from "../AuthGuard";
import { WithAppbarLayout } from "../WithAppbarLayout";


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
