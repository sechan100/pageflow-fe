import { STYLES } from '@/global/styles';
import { Box, Paper, Typography } from '@mui/material';
import { ReadableFolderContent } from '../model/readable-content';
import { useContainerPageMeasurementStore } from '../stores/use-container-page-measurement-store';
import { useReaderStyleStore } from '../stores/use-reader-style-store';

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
  const { pageMeasurement } = useContainerPageMeasurementStore();

  return (
    <Paper
      elevation={0}
      sx={{
        width: pageMeasurement.halfPage - pageMeasurement.gap,
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
  );
};
