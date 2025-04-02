/**
 * 모든 전역 Provider들은 해당 프로바이더 하나에서 모두 중첩 관리하여 내보낸다.
 */
'use client';
import { UseAuthenticationProvider } from "@/global/authentication/authentication";
import { ApplicationPropertiesProvider } from "@/global/properties";
import { DialogProvider } from "@/shared/ui/use-dialog";
import { ErrorCatchProvider } from "./ErrorCatchProvider";
import { MUIThemeProvider } from "./MUIThemProvider";
import { NotificationProvider } from "./NotificationProvider";
import { ReactQueryProvider } from "./ReactQueryProvider";


export const PageflowGlobalProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <ReactQueryProvider>
      <MUIThemeProvider>
        <ApplicationPropertiesProvider>
          <NotificationProvider>
            <DialogProvider>
              <ErrorCatchProvider>
                <UseAuthenticationProvider>
                  {children}
                </UseAuthenticationProvider>
              </ErrorCatchProvider>
            </DialogProvider>
          </NotificationProvider>
        </ApplicationPropertiesProvider>
      </MUIThemeProvider>
    </ReactQueryProvider>
  )
}