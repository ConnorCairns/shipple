import { TextField, Box, Button } from '@mui/material';
import { useReducerContext } from '../services/ReducerProvider';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

const JoinCrawlForm = () => {
    const [state, dispatch] = useReducerContext();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const params = useParams();

    const handleSubmit = (e) => {
        setLoading(true)
        let lat;
        let long;

        fetch(`https://api.postcodes.io/postcodes/${state.postcode}`)
            .then(response => response.json())
            .then(data => {
                lat = data.result.latitude
                long = data.result.longitude
            })
            .then(() => 
                fetch(`https://shipple-api.fly.dev/api/lobby/${params.crawlID}`, {
                    crossDomain: true,
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify({
                        Name: state.userName,
                        WalkingTime: 10,
                        LastKnownLocation: {Latitude: lat, Longitude: long}
                    })
                }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    dispatch({type: 'updateGuests', payload: data.lobby.Guests.length})
                })
            )

        
        navigate(`/crawl/map/${params.crawlID}`)
    }

    return (
        <Box componenent="form" validate onSubmit={e => { e.preventDefault(); handleSubmit(e) }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField sx={{ marginTop: '1rem' }}
                id="userName"
                label="Your name"
                value={state.userName}
                required
                onChange={(e) => dispatch({ type: 'updateUserName', payload: e.target.value })}
            />
            <TextField sx={{ marginTop: '1rem' }}
                id="postcode"
                label="Postcode"
                value={state.postcode}
                required
                onChange={(e) => dispatch({ type: 'updatePostcode', payload: e.target.value })}
            />
            <LoadingButton sx={{ ml: 'auto', mt: '0.5rem' }} loading={loading} onClick={handleSubmit} variant="contained">Submit
            </LoadingButton>
        </Box>
    )
}

export default JoinCrawlForm