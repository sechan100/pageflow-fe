'use client';
import React from "react";
import { AuthGuard } from "./AuthGuard";


export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
