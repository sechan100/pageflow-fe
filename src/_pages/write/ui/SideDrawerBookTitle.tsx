'use client'
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Button, SxProps, Typography } from "@mui/material";
import { useCallback } from "react";
import { useBookContext } from "../model/book-context";



type Props = {
  sx?: SxProps;
}
export const SideDrawerBookTitle = ({
  sx
}: Props) => {
  const book = useBookContext();
  const { router } = useNextRouter();

  const goToBookEditPage = useCallback(() => {
    router.push(`/write/${book.id}`);
  }, [book.id, router]);

  return (
    <Button
      fullWidth
      variant="text"
      onClick={goToBookEditPage}
      color="inherit"
      sx={{
        py: 2,
        textTransform: 'none',
      }}
    >
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          fontSize: '1.2em',
        }}
        noWrap
      >
        {book.title}
      </Typography>
    </Button>
  )
}