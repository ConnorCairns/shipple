import { TextField, Box } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useReducerContext } from '../services/ReducerProvider';
import Button from '@mui/material/Button';

const NewCrawlForm = () => {
    const [state, dispatch] = useReducerContext();

    const handleSubmit = (e) => {
        console.log("submitted!")
        console.log(state)
    }

    return (
        <Box componenent="form" onSubmit={e => { e.preventDefault(); handleSubmit() }} sx={{display: 'flex', flexDirection: 'column'}}>
            <TextField sx={{marginTop: '1rem', marginBottom: '1rem'}}
                id="Name"
                label="Name"
                value={state.name}
                onChange={(e) => dispatch({type: 'updateName', payload: e.target.value})}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Date&Time picker"
                    value={state.date}
                    onChange={(newDate) => dispatch({ type: 'updateDate', payload: newDate })}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Button sx={{ ml: 'auto', mt: '0.5rem' }} variant="outlined" onClick={handleSubmit}>Submit</Button>
        </Box>
    )
}

export default NewCrawlForm