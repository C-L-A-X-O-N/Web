import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  ListItemIcon,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useAccidents } from '../provider/AccidentProvider';

const drawerWidth = 240;

export default function Sidebar() {
  const { accidents } = useAccidents();
  
  console.log("Sidebar: Nombre d'accidents reçus:", accidents.length, accidents);

  const formatCoordinates = (position: [number, number]) => {
    return `${position[0].toFixed(3)}, ${position[1].toFixed(3)}`;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box'},
        top:'64px'
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Toolbar />
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Véhicules en panne :
        </Typography>
        <List dense>
          {accidents.map((accident) => (
            <ListItem key={accident.id} disablePadding sx={{ py: 0.5 }}>
              <ListItemButton sx={{ py: 0.5, px: 1 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <Warning color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="caption" fontWeight="bold" display="block">
                      {accident.id}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.2 }}>
                      {formatCoordinates(accident.position)} • T{accident.start_time}
                    </Typography>
                  }
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.75rem',
                      lineHeight: 1.2,
                      mb: 0.2
                    },
                    '& .MuiListItemText-secondary': { 
                      fontSize: '0.65rem',
                      lineHeight: 1.1
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          {accidents.length === 0 && (
            <ListItem sx={{ py: 1 }}>
              <ListItemText 
                primary={
                  <Typography variant="caption" sx={{ textAlign: 'center', fontStyle: 'italic', fontSize: '0.75rem' }}>
                    Aucun véhicule en panne
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
