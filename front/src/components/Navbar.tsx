import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Toolbar, AppBar } from '@mui/material';

function NavigationTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#e0e0e0',
          color: '#000',
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ fontWeight: 400, letterSpacing: '0.2em' }}
          >
            C-L-A-X-O-N
          </Typography>
        </Toolbar>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="navigation"
          sx={{ pl: 2 }}
        >
          <Tab label="Événements" />
          <Tab label="Paramètres SUMO" />
        </Tabs>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {value === 0 && <Typography>Contenu des Événements</Typography>}
        {value === 1 && <Typography>Contenu des Paramètres SUMO</Typography>}
      </Box>

      </Box>
  );
}

export default NavigationTabs;
