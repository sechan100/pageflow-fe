'use client';

import { SvTocFolder, SvTocSection } from "@/entities/book";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Divider, Paper, Typography } from "@mui/material";
import { sampleToc } from "../data/sample-toc";

type Props = {
  compact?: boolean;
}

export const TableOfContents = ({ compact = false }: Props) => {
  const renderTocNode = (node: SvTocFolder | SvTocSection, level = 0) => {
    if (node.type === "SECTION") {
      return (
        <Box
          key={node.id}
          sx={{
            pl: level * 2,
            py: compact ? 0.5 : 0.75,
            display: 'flex',
            alignItems: 'center',
            borderBottom: compact ? 'none' : '1px solid',
            borderColor: 'divider',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <Typography
            variant={compact ? "body2" : "body1"}
            sx={{
              fontWeight: 400,
              color: 'text.primary',
            }}
          >
            {node.title}
          </Typography>
        </Box>
      );
    }

    return (
      <Box key={node.id}>
        <Box
          sx={{
            pl: level * 2,
            py: compact ? 0.5 : 0.75,
            display: 'flex',
            alignItems: 'center',
            borderBottom: compact ? 'none' : '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant={compact ? "body2" : "body1"}
            sx={{ fontWeight: 600 }}
          >
            {node.title}
          </Typography>
        </Box>
        {node.children.map(child => renderTocNode(child, level + 1))}
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <MenuBookIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h4" gutterBottom>
          목차
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ maxHeight: compact ? 300 : 400, overflowY: 'auto', pr: 1 }}>
        {renderTocNode(sampleToc.root)}
      </Box>
    </Paper>
  );
};
