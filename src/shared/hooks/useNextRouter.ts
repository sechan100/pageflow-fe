'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';


export const useNextRouter = () => {
  const router = useRouter();

  /**
   * uri: '/posts/[id]' => '/posts/123'
   * params = { id: '123' }
   */
  const params = useParams();

  /**
   * uri: '/dashboard/settings?tab=profile
   * pathname = '/dashboard/settings'
   */
  const pathname = usePathname();

  /**
   * uri: '/dashboard?tab=profile&view=grid'
   * const tab = searchParams.get('tab'); // 'profile'
   * const view = searchParams.get('view'); // 'grid'
   */
  const searchParams = useSearchParams();

  return {
    router,
    params,
    pathname,
    searchParams,
  };
};
