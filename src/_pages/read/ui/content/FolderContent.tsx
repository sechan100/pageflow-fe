import { STYLES } from '@/global/styles';
import { Box, Paper, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { ReadableFolderContent } from '../../model/readable-content';
import { useReaderStyleStore } from '../../stores/reader-style-store';
import { DATA_TOC_FOLDER_ID } from '../container/node-element';
import { usePageMeasurementStore } from '../container/page-measurement';
import { FOLDER_CONTENT_WRAPPER_CLASS_NAME } from '../container/readable-content';


type WrapperProps = {
  folder: ReadableFolderContent;
  children: React.ReactNode;
}
export const Wrapper = ({
  folder,
  children,
}: WrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { viewportHeight } = useReaderStyleStore();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute(DATA_TOC_FOLDER_ID, folder.id);
  }, [folder.id, viewportHeight]);

  return (
    <Box
      component={"div"}
      ref={ref}
      className={FOLDER_CONTENT_WRAPPER_CLASS_NAME}
      sx={{
      }}
    >
      {children}
    </Box>
  )
}


type TitleProps = {
  title: string;
}
const Title = ({
  title,
}: TitleProps) => {

  return (
    <Typography
      variant="h6"
      sx={{
        fontSize: 20,
        fontWeight: 500,
        userSelect: "none",
      }}
    >
      {title}
    </Typography>
  )
}

type Props = {
  folder: ReadableFolderContent;
};
export const FolderContent = ({
  folder,
}: Props) => {
  const { viewportWidth, viewportHeight } = useReaderStyleStore();
  const { halfPage, gap } = usePageMeasurementStore();

  return (
    <Wrapper folder={folder}>
      <Paper
        elevation={0}
        sx={{
          width: halfPage - gap,
          height: `${viewportHeight}vh`,
          backgroundColor: STYLES.color.backgroundHsla({
            h: 0,
            s: 0,
            l: -3,
          }),
        }}
      >
        <Box sx={{
          pt: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Title title={folder.title} />
        </Box>
      </Paper>
    </Wrapper>
  );
};
