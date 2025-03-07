import { create } from "zustand";
import { useApplicationProperties } from "../properties";


const SESSION_FLAG_NAME = "pageflowSessionExpiredAt" as const;

// 클라이언트 환경에서만 콜백을 실행
const callOnClient = (callback: Function) => {
  while(typeof window !== "undefined" && typeof window.localStorage !== "undefined"){
    return callback();
  }
}

/**
 * 로컬 스토리지에서 세션 flag를 확인하여 세션이 유효한지 확인한다.
 * 정확한건 서버에 요청을 보내서 확인해야하지만, 해당 함수를 통해서 간단하게 클라이언트에서 세션상태를 불러올 수 있다.
 */
const isSessionFlagValid = () => callOnClient(() => {
  const sessionFlag = localStorage.getItem(SESSION_FLAG_NAME);
  if(!sessionFlag) return false;

  const isSessionExpired = Number(sessionFlag) < Date.now();
  if(isSessionExpired){
    return false;
  } else {
    return true;
  }
})


type UseAuthentication = {
  isAuthenticated: boolean;
  authenticate: () => void;
  deAuthenticate: () => void;
}

/**
 * local storage에 저장된 SESSION_FLAG를 통해서 인증여부를 '최초' 판단한다.
 * 이후에 다양한 로직들이 서버와 소통하면서 실제로 세션이 존재하지 않는 경우, 해당 상태를 적절히 업데이트해준다.
 */
export const useAuthentication = create<UseAuthentication>((set) => ({
  isAuthenticated: isSessionFlagValid(),
  authenticate: () => {
    callOnClient(() => {
      const expiredAt = Date.now() + 1000 * 60 * 60 * 24 * useApplicationProperties.getState().refreshTokenExpireDays; // x일 뒤 만료
      localStorage.setItem(SESSION_FLAG_NAME, String(expiredAt));
    })
    set({ isAuthenticated: true });
  },

  deAuthenticate: () => {
    callOnClient(() => localStorage.removeItem(SESSION_FLAG_NAME))
    set({ isAuthenticated: false });
  } 
}));