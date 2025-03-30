"use client";
import { useSessionQuery } from "@/entities/user";
import { AccountSettingsPage } from "@/pages/settings";


export default function Page() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.toc) {
    return <div>Loading...</div>;
  }

  return <AccountSettingsPage session={sessionQuery.toc} />;
}