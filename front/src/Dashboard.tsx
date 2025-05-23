import { Box, Typography, Checkbox, FormControlLabel, Paper } from '@mui/material';

export default function Dashboard() {
  return (
    <Box>
      {/* Colonne gauche : événements */}
      <Box>
        <Typography variant="h6">Liste des événements :</Typography>
        <ul>
          <li>Bouchon 1 périph</li>
          <li>Bouchon 2 périph</li>
          <li>Accident</li>
        </ul>
      </Box>

      {/* Carte + Options */}
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        {/* TODO: intégrer carte Leaflet ici */}
        <Paper elevation={3} sx={{ height: '100%', p: 2 }}>
          <Typography variant="body2">[Carte ici]</Typography>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <FormControlLabel control={<Checkbox defaultChecked />} label="Véhicules" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Zones de congestion" />
            <FormControlLabel control={<Checkbox defaultChecked />} label="Bouchons" />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
