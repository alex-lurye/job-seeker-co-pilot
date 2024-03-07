import {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import configData from '../../config';
import { LOGOUT } from './../../store/actions';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import MainCard from '../../ui-component/cards/MainCard';
import SubCard from '../../ui-component/cards/SubCard'; // Import the SubCard component
import { Button } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'; // Import the AddCircleOutlineIcon component
import { Box } from '@material-ui/core'; 
import  TextField  from '@material-ui/core/TextField';



const PositionDetails = () => {
    const [position, setPosition] = useState({

        company:'',
        title:'',
        description:'',
        date:''
    });
    let { id } = useParams();

    const account = useSelector((state) => state.account);

    const dispatcher = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(configData.API_SERVER + 'positions/' + id, {
                    headers: { Authorization: `${account.token}` }, // Assuming you need to authorize
                });
                const data = response.data;
                console.log(data);
                setPosition(data || []);
            } catch (error) {
                if(error.response){
                    if(error.response.status === 401 || error.response.status === 403 ) {
 
                        dispatcher({type: LOGOUT })
                    }
                }
                console.error('Failed to fetch positions:', error);
                // Handle error appropriately
            }
        };

        fetchData();
    }, []); // useEffect dependency array

    const generateResume = () => {
        // Add your logic here
    };

    const generateCover = () => {
        // Add your logic here
    };

    return (
        <MainCard title="Position management">
            {position && (
                <>
                    <SubCard title="Position details">
                        <h2>{position.title}</h2>
                        <h3>{position.company}</h3>
                        <Box sx={{ width: '100%', overflow: 'hidden' }}>
                            <TextField
                                fullWidth
                                multiline
                                value={position.description}
                                InputProps={{
                                readOnly: true,
                                }}
                                variant="outlined"
                                sx={{
                                '& .MuiInputBase-inputMultiline': {
                                    height: '200px', // Adjust the height as needed
                                    overflow: 'auto',
                                },
                                }}
                            />
                        </Box>
                        <p style={{ fontSize: 'small', textAlign: 'right' }}>{position.date}</p>
                    </SubCard>
                    <SubCard title="Submission helper">
                        <Box display="flex" justifyContent="center" gap="16px" p={1}>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={generateResume}
                                variant="contained"
                            >Generate Resume</Button>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={generateCover}
                                variant="contained"
                            >Generate Cover Letter</Button>
                        </Box>
                    </SubCard>
                </>
            )}
        </MainCard>
    );
}

export default PositionDetails;