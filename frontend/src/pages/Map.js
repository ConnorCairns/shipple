import { Box, Button, ButtonGroup, Checkbox, Container, FormControlLabel, Grid, Paper, Stack, Toolbar } from '@mui/material';
import Title from '../components/Title';
import { useReducerContext } from '../services/ReducerProvider';


function Paragraph() {
    const [state, dispatch] = useReducerContext()

    switch(state.algorithm){
        case 'ai':
            return (
                <p>
                    The AI approach does some kind of machine learning...
                </p>
            )
        case 'kMeans':
            return (
                <p>
                    K means is a clustering algorithm that assigns datapoints to cluster centres.
                </p>
            )
        case 'fosters':
            return (
                <p>
                    This algorithm prioritises pubs that sell Fosters beer.
                </p>
            )
        case 'tsp':
            return (
                <p>
                    This is another algorithm...
                </p>
            )
        default:
            return <p></p>
    }
}


function AlgorithmTitle() {
    const [state, dispatch] = useReducerContext()

    switch (state.algorithm) {
        case 'ai':
            return <Title>AI Algorithm:</Title>
        case 'kMeans':
            return <Title>K Means Algorithm:</Title>
        case 'fosters':
            return <Title>Fosters Algorithm:</Title>
        case 'tsp':
            return <Title>TSP Algorithm:</Title>
        default:
            return <Title></Title>
    }
}


function DaysToGo() {
    const [state, dispatch] = useReducerContext()
    const today = new Date()
    const diffTime = Math.abs(today - state.date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
}


const Map = () => {
    const [state, dispatch] = useReducerContext()

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
        <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: '0.5rem' }}>
                        <Title>{state.name}</Title>
                        <Stack direction="row" spacing={2} justifyContent='space-evenly'>
                            <Paper elevation={0}>{state.responses} responded</Paper>
                            <Paper elevation={0}>
                                <DaysToGo></DaysToGo> days to go
                            </Paper>
                            <Paper elevation={0}>
                                Invite link: <a href={state.crawlID}>{state.crawlID}</a>
                            </Paper>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={2}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <FormControlLabel control={<Checkbox></Checkbox>} label="Show crawlers" />
                        <Title>Routes:</Title>
                        <ButtonGroup orientation='vertical'>
                            <Button onClick={() => dispatch({ type: 'updateAlgorithm', payload: "ai" })}>AI</Button>
                            <Button onClick={() => dispatch({ type: 'updateAlgorithm', payload: "kMeans" })}>K Means</Button>
                            <Button onClick={() => dispatch({ type: 'updateAlgorithm', payload: "fosters" })}>Fosters</Button>
                            <Button onClick={() => dispatch({ type: 'updateAlgorithm', payload: "tsp" })}>TSP</Button>
                        </ButtonGroup>
                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper>Map</Paper>
                </Grid>
                <Grid item xs={3}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <AlgorithmTitle></AlgorithmTitle>
                        <Paragraph algorithm='ai'></Paragraph>
                        <Title>Stats:</Title>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Paper elevation={4}>{state.carbon} tonnes of carbon</Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper elevation={4}>£{state.uberSavings} saved on Ubers</Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper elevation={4}>{state.walkingDist}km walked</Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper elevation={4}>{state.pintOptions} pint options</Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    </Box>
    )
}

export default Map
