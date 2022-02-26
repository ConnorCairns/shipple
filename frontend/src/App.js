import Dashboard from "./pages/Dashboard";
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Map from "./pages/Map";
import Lobby from "./pages/Lobby";
import useChannel from "./services/channel/useChannel";
import Test from "./pages/Test";


const theme = createTheme({
  palette: {
    mode: 'light',
    action: {
      hover: 'rgba(0, 0, 0, 0.06)'
    }
  }
})

function App() {
  const UNSUBSCRIBE = useChannel("fosters crawl", "abc123")

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
              <Route path="/map" element={<Map />} />
            </Routes>
          </Router>
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
}

export default App;
