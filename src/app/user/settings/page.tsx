'use client'

import { useNextRouter } from "@/shared/hooks/useNextRouter"
import { useEffect } from "react";


export default function SettingsPage() {
  const { router } = useNextRouter();

  useEffect(() => {
    router.replace("/user/settings/profile");
  }, [router]);

  return (
    <>
    </>
  )
}