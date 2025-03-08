/**
 * 모든 전역 Provider들은 해당 프로바이더 하나에서 모두 중첩 관리하여 내보낸다.
 */
'use client';
import { MUIThemeProvider } from "./MUIThemProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { NotificationProvider } from "./NotificationProvider";
import { ErrorCatchProvider } from "./ErrorCatchProvider";
import { UseAuthenticationProvider } from "@/global/authentication/authentication";


export const PageflowGlobalProvider = ({children} : {children: React.ReactNode}) => {

  return (
    <ReactQueryProvider>
      <MUIThemeProvider>
        <NotificationProvider>
          <ErrorCatchProvider>
            <UseAuthenticationProvider>
              {children}
            </UseAuthenticationProvider>
          </ErrorCatchProvider>
        </NotificationProvider>
      </MUIThemeProvider>
    </ReactQueryProvider>
  )
}