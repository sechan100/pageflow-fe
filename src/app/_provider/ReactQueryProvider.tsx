import { createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false, // 마운트 시에 리패치
      refetchOnWindowFocus: false, // 윈도우 포커스 시에 리패치
      retry: false, // 실패 시 재시도
      staleTime: 1000 * 60 * 60 // staleTime 1시간
    }
  }
});

export const QueryClientContext = createContext(queryClient);


export const ReactQueryProvider = ({children} : {children: React.ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryClientContext.Provider value={queryClient}>
          {children}
      </QueryClientContext.Provider>
    </QueryClientProvider>
  )
}