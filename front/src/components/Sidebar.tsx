import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Typography,
} from '@mui/material';

const drawerWidth = 240;

const events = [
  'Bouchon 1 périph',
  'Bouchon 2 périph',
  'Accident',
  'Travaux',
  'Zone inondée',
];

export default function Sidebar() {
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
          Liste des événements :
        </Typography>
        <List>
          {events.map((event, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => alert(`Événement : ${event}`)}>
                <ListItemText primary={event} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
