import { Box, Button, ButtonGroup, Checkbox, Container, FormControlLabel, Grid, Paper, Toolbar } from '@mui/material';
import Title from '../components/Title';

const Map = () => {
    return(
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: '0.5rem' }}>
                        <Title>Event name</Title>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>x/y responded</Grid>
                            <Grid item xs={3}>x days to go</Grid>
                            <Grid item xs={3}>
                                <p>invite link:</p>
                                <a href='http://localhost:3000/'>Share this URL</a>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Show crawlers" />
                        <Title>Routes:</Title>
                        <ButtonGroup orientation='vertical'>
                            <Button>AI</Button>
                            <Button>K Means</Button>
                            <Button>Fosters</Button>
                            <Button>TSP</Button>
                        </ButtonGroup>
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper>Map</Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper>
                        <Title>K Means Algorithm</Title>
                        <p>
                            This algorithm assigns each of the given datapoints to one of k different cluster centres. 
                            It uses a machine learning approach to update its prediction of the cluster centres as well as the assignment of datapoints to these centres.
                        </p>
                        <Title>Stats:</Title>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>10 tonnes</Grid>
                            <Grid item xs={6}>£50</Grid>
                            <Grid item xs={6}>2km walked</Grid>
                            <Grid item xs={6}>100 pint options</Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
    )
}

export default Map
