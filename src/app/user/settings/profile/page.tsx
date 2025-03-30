"use client";
import { useSessionQuery } from '@/entities/user';
import { ProfileSettingsPage } from '@/pages/settings';


export default function Page() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.toc) {
    return <div>Loading...</div>;
  }

  return <ProfileSettingsPage session={sessionQuery.toc} />;
}