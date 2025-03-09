/** @jsxImportSource @emotion/react */

import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Typography } from "@mui/material";

export const BarLogo = () => {
  const { router } = useNextRouter();

  return (
    <div
      css={{
        width: 100,
        marginLeft: 20,
        color: 'black',
        cursor: 'pointer',
      }}
      onClick={() => router.push('/')}
    >
      Pageflow
    </div>
  );
}