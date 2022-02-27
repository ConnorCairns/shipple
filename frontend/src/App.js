import Dashboard from "./pages/Dashboard";
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Map from "./pages/Map";
import Lobby from "./pages/Lobby";
import Test from "./pages/Test";
import ClientJoin from "./pages/ClientJoin";


const theme = createTheme({
  palette: {
    mode: 'light',
    action: {
      hover: 'rgba(0, 0, 0, 0.06)'
    }
  }
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Box sx={{ display: 'flex' }}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crawl" element={<Lobby />} />
              <Route path="/crawl/:crawlID" element={<Test />} />
              <Route path="/crawl/join/:crawlID" element={<ClientJoin />} />
              <Route path="/crawl/map/:crawlID" element={<Map />} />
            </Routes>
          </Router>
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
