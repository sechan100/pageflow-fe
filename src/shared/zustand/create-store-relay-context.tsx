import { memo } from "react";
import { StoreApi } from "zustand";
import { ZustandStore } from "./zustand-store";

type StoreContextProviderComponent<T> = React.FC<{
  children: React.ReactNode;
  store: T;
}>;

/**
 * ZustandStore를 받아서 context로 뿌려주는 Provider와 그 훅을 생성하는 함수.
 * 
 * 절대로 여러개의 Provider를 렌더링하지 않도록 주의해야 한다.
 * 하나의 createStoreRelayContext에서 생성된 Provider는 단 1개의 context만을 제공할 수 있다. (react context api처럼 사용 X)
 */
export const createStoreRelayContext = <S,>(): [StoreContextProviderComponent<ZustandStore<S>>, ZustandStore<S>] => {
  let storeInstance: ZustandStore<S> | null = null;

  const ContextProvider: StoreContextProviderComponent<ZustandStore<S>> = memo(function Provider({ children, store }) {
    storeInstance = store;
    return <>{children}</>;
  });

  const getStore = () => {
    if (!storeInstance) {
      throw new Error("store가 초기화되지 않았습니다. ContextProvider가 렌더링된 후에 훅을 호출할 수 있습니다.");
    }
    return storeInstance;
  }

  // useStore hook 구현
  const useStoreHook = ((selector?: any) => {
    const store = getStore();
    return store(selector);
  }) as ZustandStore<S>;

  // 스토어 메서드를 hook에 추가
  Object.defineProperties(
    useStoreHook,
    Object.getOwnPropertyDescriptors({
      getState: () => getStore().getState(),
      setState: (...args: Parameters<StoreApi<S>['setState']>) => getStore().setState(...args),
      subscribe: (...args: Parameters<StoreApi<S>['subscribe']>) => getStore().subscribe(...args),
      getInitialState: () => getStore().getInitialState(),
    })
  );

  return [ContextProvider, useStoreHook];
}