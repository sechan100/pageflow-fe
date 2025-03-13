'use client'
import { ApplicationProperties, useApplicationProperties } from "../properties";
import { createStoreContext } from "@/shared/zustand/create-store-context";
import { useEffect, useState } from "react";


const SESSION_FLAG_NAME = "pageflowSessionExpiredAt" as const;


type UseAuthentication = {
  isAuthenticated: boolean;
  /**
   * isAuthenticated 값을 localStorage에서 뒤늦게 가져오기 때문에, 로딩 상태를 표시하기 위한 변수
   */
  isAuthenticatedLoading: boolean;

  authenticate: () => void;
  deAuthenticate: () => void;
}


type UseAuthenticationProviderData = {
  isAuthenticated: boolean;
  isAuthenticatedLoading: boolean;
}

/**
 * local storage에 저장된 SESSION_FLAG를 통해서 인증여부를 '최초' 판단한다.
 * 이후에 다양한 로직들이 서버와 소통하면서 실제로 세션이 존재하지 않는 경우, 해당 상태를 적절히 업데이트해준다.
 */
const [Provider, useStore] = createStoreContext<
  UseAuthenticationProviderData,
  UseAuthentication
>(({ isAuthenticated, isAuthenticatedLoading }, set) => ({
  isAuthenticated,

  isAuthenticatedLoading,

  authenticate: () => {
    const refreshTokenExpireDays = useApplicationProperties.getState().user.refreshTokenExpireDays;
    const expiredAt = Date.now() + 1000 * 60 * 60 * 24 * refreshTokenExpireDays; // x일 뒤 만료
    localStorage.setItem(SESSION_FLAG_NAME, String(expiredAt));
    set({ isAuthenticated: true });
  },

  deAuthenticate: () => {
    localStorage.removeItem(SESSION_FLAG_NAME);
    set({ isAuthenticated: false });
  }
}));


/**
 * 로컬 스토리지에서 세션 flag를 확인하여 세션이 유효한지 확인한다.
 * 정확한건 서버에 요청을 보내서 확인해야하지만, 해당 함수를 통해서 간단하게 클라이언트에서 세션상태를 불러올 수 있다.
 */
const isSessionValid = () => {
  const sessionFlag = localStorage.getItem(SESSION_FLAG_NAME);
  if (!sessionFlag) return false;

  const isSessionExpired = Number(sessionFlag) < Date.now();
  if (isSessionExpired) {
    return false;
  } else {
    return true;
  }
}


export const UseAuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<UseAuthenticationProviderData>({
    isAuthenticated: false,
    isAuthenticatedLoading: true,
  });

  useEffect(() => {
    const isAuthenticated = isSessionValid();
    setData({
      isAuthenticated,
      isAuthenticatedLoading: false,
    });
  }, [])

  return (
    <Provider
      data={data}
      onDataChange={(store, { isAuthenticated, isAuthenticatedLoading }) => {
        store.setState({
          isAuthenticated,
          isAuthenticatedLoading,
        })
      }}
    >
      {children}
    </Provider>
  )
}
export const useAuthentication = useStore;