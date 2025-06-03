import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Toolbar, AppBar } from '@mui/material';

function NavigationTabs() {
  const [value, setValue] = useState(0);

  const handleChange = ( _:any, newValue:number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <AppBar position="fixed"
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
            CLAXON
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
      </Box>
  );
}

export default NavigationTabs;