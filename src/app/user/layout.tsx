'use client';
import React from "react";
import { AuthGuard } from "../_utils/AuthGuard";
import { WithAppbarLayout } from "../_utils/WithAppbarLayout";


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
