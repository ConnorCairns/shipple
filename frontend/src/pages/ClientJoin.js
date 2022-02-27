import { Box, Toolbar, Container, Paper } from '@mui/material';
import { useParams } from "react-router"
import JoinCrawlForm from '../components/JoinCrawlForm';
import Title from '../components/Title';

const ClientJoin = () => {
    const params = useParams();

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
                    <Title>Joining {params.crawlID}</Title>
                    <JoinCrawlForm />
                </Paper>
            </Container>
        </Box>
    )
}

export default ClientJoin