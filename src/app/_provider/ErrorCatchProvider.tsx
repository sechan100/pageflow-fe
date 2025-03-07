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

  // 에러 핸들러
  const handleError = useCallback((error: Error) => {
    if(error instanceof ProcessResultError){
      const n = error.getNotification();
      notification.show(n.message, {
        severity: n.severity,
        autoHideDuration: AUTO_HIDE_DURATION
      });
    } else {
      console.error(error);
      notification.error();
    }
  }, [notification])


  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => handleError(event.error);
    const rejectionHandler = (event: PromiseRejectionEvent) => handleError(event.reason);
    
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
  
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);
  
  return (
    <div>
      {children}
    </div>
  )
}