import { TextField, Box } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useReducerContext } from '../services/ReducerProvider';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NewCrawlForm = () => {
    const [state, dispatch] = useReducerContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('http://localhost:8080/api/lobby', {
            crossDomain: true,
            method: 'POST',
            mode: 'cors',
        })
            .then(response => response.json()
            .then(out => {
                dispatch({ type: 'updateCrawlID', payload: out.lobby_id })
                setLoading(false)
            }))
    }, [dispatch])

    const handleSubmit = (e) => {
        navigate(`/crawl/${state.name}`)
    }

    return (
        <Box componenent="form" validate onSubmit={e => { e.preventDefault(); handleSubmit() }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                id="Name"
                label="Name"
                value={state.name}
                required
                onChange={(e) => dispatch({ type: 'updateName', payload: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Date&Time picker"
                    value={state.date}
                    onChange={(newDate) => dispatch({ type: 'updateDate', payload: newDate })}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <TextField sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                id="walkingDist"
                label="Maximum Walking Distance"
                value={state.walkingDist}
                onChange={(e) => dispatch({ type: 'updateWalkingDist', payload: e.target.value })}
            />
            <LoadingButton sx={{ ml: 'auto', mt: '0.5rem' }} onClick={handleSubmit} loading={loading} variant="contained">Submit
            </LoadingButton>
        </Box>
    )
}

export default NewCrawlForm