import React, { createContext, memo, useContext } from "react";


type ContextProviderComponent<T> = React.FC<{
  children: React.ReactNode;
  value: T;
}>;

type UseDataHook<T> = () => T;

export const createDataContext = <T,>(): [ContextProviderComponent<T>, UseDataHook<T>] => {
  const DataContext = createContext<T | null>(null);

  const useData = (): T => {
    const data = useContext(DataContext);
    if (!data) {
      throw new Error('컨텍스트 외부에서 useContext가 사용되고 있거나, 데이터가 올바르게 초기화되지 않았습니다.');
    }
    return data;
  }

  const ContextProvider = memo(function C({ children, value }: { children: React.ReactNode; value: T }) {
    return (
      <DataContext.Provider value={value}>
        {children}
      </DataContext.Provider>
    )
  });

  return [ContextProvider, useData];
}