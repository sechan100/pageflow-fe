import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation';
import { create } from 'zustand';

interface UrlState {
  [url: string]: any;
  setUrlState: (url: string, state: any) => void;
  getUrlState: (url: string) => any;
  removeUrlState: (url: string) => void;
}

const useUrlState = create<UrlState>((set, get) => ({
  setUrlState: (url, newState) => {
    set((state) => {
      return {
        ...state,
        [url]: newState
      };
    });
  },

  getUrlState: (url) => {
    return get()[url];
  },

  removeUrlState: (url) => {
    set((state) => {
      const newState = { ...state };
      delete newState[url];
      return newState;
    });
  },
}));

// next에서 제공하는 route hook에 기능을 추가하여 확장한 커스텀 hook
export const useNextRouter = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlState = useUrlState();

  const wrapWithUrlState = (func: Function) => {
    return (href: string, state?: any, options?: NavigateOptions) => {
      if (typeof state === 'object' && state !== null) {
        urlState.setUrlState(href, state);
      }
      func(href, options);
      return;
    };
  };

  /*
   * push할 때 데이터를 queryString 형태가 아니면 넘길 수가 없다고 그래서 커스텀
   */ 
  const enhancedRouter = {
    ...router,
    push: wrapWithUrlState(router.push),
    replace: wrapWithUrlState(router.replace),
  };

  return {
    router: enhancedRouter,
    params,
    pathname,
    searchParams,
    getUrlState: () => urlState.getUrlState(pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')),
  };
};
