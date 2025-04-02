'use client'
import { NotificationProvider as BaseNotificationProvider } from "@/shared/ui/notification"




type Props = {
  children: React.ReactNode
}
export const NotificationProvider = ({
  children,
}: Props) => {

  return (
    <BaseNotificationProvider anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}>
      {children}
    </BaseNotificationProvider>
  )
}