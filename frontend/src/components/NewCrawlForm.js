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
    const [loading, setLoading] = useState(false)

    const createLobby = () => {
        fetch('http://localhost:8080/api/lobby', {
            crossDomain: true,
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                Name: state.crawlName,
                ScheduledTime: Math.floor(new Date('2012.08.10').getTime() / 1000),
                Admin: {
                    Name: state.userName
                }
            })
        })
            .then(response => response.json()
            .then(out => {
                dispatch({ type: 'updateCrawlID', payload: out.lobby_id })
                setLoading(false)
                navigate(`/crawl/${out.lobby_id}`)
            }))
    }

    return (
        <Box componenent="form" validate onSubmit={e => { e.preventDefault(); createLobby() }} sx={{ display: 'flex', flexDirection: 'column' }}>
            <TextField sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                id="userName"
                label="Your name"
                value={state.userName}
                required
                onChange={(e) => dispatch({ type: 'updateUserName', payload: e.target.value })}
            />
            <TextField sx={{ marginTop: '1rem', marginBottom: '1rem' }}
                id="crawlName"
                label="Bar crawl title"
                value={state.crawlName}
                required
                onChange={(e) => dispatch({ type: 'updateCrawlName', payload: e.target.value })}
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
            <LoadingButton sx={{ ml: 'auto', mt: '0.5rem' }} onClick={createLobby} loading={loading} variant="contained">Submit
            </LoadingButton>
        </Box>
    )
}

export default NewCrawlForm