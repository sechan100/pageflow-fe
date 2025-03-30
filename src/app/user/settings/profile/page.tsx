"use client";
import { useSessionQuery } from '@/entities/user';
import { ProfileSettingsPage } from '@/pages/settings';


export default function Page() {
  const sessionQuery = useSessionQuery();

  if (!sessionQuery.data) {
    return <div>Loading...</div>;
  }

  return <ProfileSettingsPage session={sessionQuery.data} />;
}