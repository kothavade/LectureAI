import { Box, ScrollArea } from '@mantine/core';

type ScrollableTextProps = {
  text: string;
};

export const ScrollableText = ({ text }: ScrollableTextProps) => (
  <ScrollArea
    sx={{
      height: 900,
      border: '1px solid',
      borderTop: 'none',
      borderColor: '#dee2e6',
      padding: 2,
    }}
  >
    {/* outline around the sides */}
    <Box style={{ whiteSpace: 'pre-wrap' }}>{text}</Box>
  </ScrollArea>
);
