import { Box, Toolbar, Container, Paper } from '@mui/material';
import Title from '../components/Title';

const Dashboard = () => {

    return (
        <Box component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: '0.5rem' }}>
                    <Title>Dashboard</Title>
                    <p>lorem ipsym lorem ipsymlorem ipsymlorem ipsymlorem ipsymlorem ipsym</p>
                </Paper>
            </Container>
        </Box>
    )
}

export default Dashboard