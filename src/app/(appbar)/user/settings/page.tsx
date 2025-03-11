'use client'

import { useNextRouter } from "@/shared/hooks/useNextRouter"
import { useEffect } from "react";



type Props = {
  className?: string
}
export default function SettingsPage({
  className
}: Props) {
  const { router } = useNextRouter();

  useEffect(() => {
    router.replace("/user/settings/profile");
  }, []);

  return (
    <>
    </>
  )
}