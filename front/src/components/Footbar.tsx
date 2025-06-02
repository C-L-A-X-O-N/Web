import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        height: '60px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 'auto',
        borderTop: '1px solid #ddd',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        Voiliiii Bam !
      </Typography>
    </Box>
  );
}
