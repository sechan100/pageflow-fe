/** @jsxImportSource @emotion/react */
'use client'

import { useNotification } from "@/shared/notification"
import { ProcessResultError } from "@/global/ProcessResultError"
import { useCallback, useEffect } from "react"
import { AUTO_HIDE_DURATION } from "@/shared/notification/use-notification"



type Props = {
  children: React.ReactNode
}
export const ErrorCatchProvider = ({
  children
}: Props) => {
  const notification = useNotification();

  useEffect(() => {
    // 에러 핸들러
    const handleError = (event: ErrorEvent | PromiseRejectionEvent) => {
      const error: Error = event instanceof ErrorEvent ? event.error : event.reason;

      if(error instanceof ProcessResultError){
        const n = error.getNotification();
        notification.show(n.message, {
          severity: n.severity,
          autoHideDuration: AUTO_HIDE_DURATION
        });
      } else {
        notification.error();
      }

      // 에러를 처리
      event.preventDefault();
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
  
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  return (
    <div>
      {children}
    </div>
  )
}