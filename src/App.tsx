import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import Footer from './components/Footbar';

const appBarHeight = 96; // AppBar (64) + Tabs (32)

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
      <CssBaseline />
      {/* Navbar (AppBar) sans position="fixed" */}
      <Navbar />

     <Box sx={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Contenu principal (Map) + Footer */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {/* Map prend tout l'espace restant */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <Map />
          </Box>

          {/* Footer taille fixe */}
          <Box sx={{ height: '60px', bgcolor: '#f5f5f5' }}>
            <Footer />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
