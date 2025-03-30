/**
 * zustand store를 특정 값을 가지고 초기화할 수 있도록 해주는 유틸함수.
 * Context API를 사용하지 않고 전역 변수를 통해 관리합니다.
 */
import React, { useEffect, useRef } from 'react';
import { StoreApi, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

/**
 * D: 초기 데이터 타입
 * S: store 상태 타입
 */
type SetState<S> =
  (partial: S | Partial<S> | ((state: S) => S | Partial<S>), replace?: false) => void
    |
    ((state: S | ((state: S) => S), replace: true) => void);
type GetState<S> = () => S
type Initializer<D, S> = (data: D, set: SetState<S>, get: GetState<S>) => S

// 해당 함수는 '(초기데이터, set, get) => store' 형태의 콜백을 받아서 초기데이터를 기반으로 store를 생성해주는 함수를 반환한다.
const createStoreWithInit: <D, S>(initializer: Initializer<D, S>) => (data: D) => StoreApi<S>
  = (initializer) => {
    return (data) => createStore((set, get) => initializer(data, set, get));
  }

type ExtractState<S> = S extends {
  getState: () => infer T;
} ? T : never;
type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'getInitialState' | 'subscribe'>;
type UseBoundStore<S extends ReadonlyStoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(selector: (state: ExtractState<S>) => U): U;
} & S;

interface StoreProviderProps<D, S> {
  data: D;
  children: React.ReactNode;
  onDataChange?: (store: StoreApi<S>, data: D) => void;
}
export const createStoreContext = <D, S>(initializer: Initializer<D, S>): [
  React.FC<StoreProviderProps<D, S>>,
  UseBoundStore<StoreApi<S>>
] => {
  const createNewStore = createStoreWithInit<D, S>(initializer);

  let storeInstance: StoreApi<S> | null = null;

  // Provider 구현 - 이제 Context 사용하지 않음
  const Provider = React.memo(function Provider({ data, children, onDataChange }: StoreProviderProps<D, S>) {
    // 첫 렌더링 시 스토어 생성
    const storeRef = useRef<StoreApi<S>>(null as unknown as StoreApi<S>);

    // storeInstance와 storeRef.current를 동기화
    if (!storeRef.current) {
      storeRef.current = createNewStore(data);
      storeInstance = storeRef.current;
    }

    // 데이터 변경 시 콜백 실행
    useEffect(() => {
      if (onDataChange && storeRef.current) {
        onDataChange(storeRef.current, data);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

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
    return useStore(getStore(), selector);
  }) as UseBoundStore<StoreApi<S>>;

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

  return [Provider, useStoreHook];
};