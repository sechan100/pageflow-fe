import { createContext, memo, RefObject, useContext } from "react";


type ContainerRef = RefObject<HTMLElement | null>;

const Context = createContext<ContainerRef>({ current: null });

export const useScrollContainerContext = (): ContainerRef => {
  const el = useContext(Context);
  return el;
}

export const ScrollContainerContextProvider = memo(function C({ children, value }: { children: React.ReactNode; value: ContainerRef }) {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
})