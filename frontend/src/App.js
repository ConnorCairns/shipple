import Dashboard from "./pages/Dashboard";
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Map from "./pages/Map";
import { ReducerProvider } from "./services/ReducerProvider";
import { initialState, reducer } from "./services/reducer";

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
    <ReducerProvider initialState={initialState} reducer={reducer} >
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Box sx={{ display: 'flex' }}>
            <Router>
              <Navbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/map" element={<Map />} />
              </Routes>
            </Router>
          </Box>
        </CssBaseline>
      </ThemeProvider>
    </ReducerProvider>
  );
}

export default App;
