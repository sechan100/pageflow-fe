"use client";
import { useSessionQuery } from "@/entities/user";
import { AccountSettingsPage } from "@/pages/settings";


export default function Page() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.data) {
    return <div>Loading...</div>;
  }

  return <AccountSettingsPage session={sessionQuery.data} />;
}