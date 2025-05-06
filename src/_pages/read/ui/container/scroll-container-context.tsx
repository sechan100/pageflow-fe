import { createContext, memo, useContext } from "react";

const Context = createContext<HTMLElement | null>(null);

export const useScrollContainerContext = (): HTMLElement | null => {
  const el = useContext(Context);
  return el;
}

export const ScrollContainerContextProvider = memo(function C({ children, value }: { children: React.ReactNode; value: HTMLElement | null }) {
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
})