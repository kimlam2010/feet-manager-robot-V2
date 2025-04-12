import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Feet Manager Robot
      </Typography>
      <Typography variant="h5" component="h2" color="text.secondary" align="center">
        A robot management system supporting real-time and offline operations
      </Typography>
    </Box>
  );
} 