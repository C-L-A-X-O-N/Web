import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './Dashboard';
import Sidebar from './components/Sidebar';
import Footer from './components/Footbar';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <CssBaseline />
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Footer />
      </Box>
    </Box>
  );
}
