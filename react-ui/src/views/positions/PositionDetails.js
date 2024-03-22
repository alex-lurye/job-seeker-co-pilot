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
import { useRef } from 'react';

const PositionDetails = () => {
    const [position, setPosition] = useState({

        company:'',
        title:'',
        description:'',
        date:''
    });
    const [jobId, setJobId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [resume, setResume] = useState(null); 

    let { id } = useParams();

    const account = useSelector((state) => state.account);

    const dispatcher = useDispatch();

    const downloadFile = async (url) => {

        try {
            const response = await fetch(url, {
              method: 'GET',
              headers: {
                'Authorization': `${account.token}`
              }
            });
        
            if (!response.ok) throw new Error('Network response was not ok.');
        
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = "resume.docx"; // Provide a filename here
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
          } catch (error) {
            console.error('Download failed:', error);
          }
    };


    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const response = await axios.get(configData.API_SERVER + 'positions/' + id, {
                    headers: { Authorization: `${account.token}` }, 
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

    var intervalId = useRef(null);
    useEffect(() => {

        if (!jobId) {
            if(intervalId.current) { 
                clearInterval(intervalId.current); intervalId.current = null; 
            } 
            return;
        }

        intervalId.current = setInterval(() => {

            console.log("Checking job status...")
            console.log("Job id: " + jobId)
            if (jobId) {
                
                axios.get(configData.API_SERVER + 'generation-status/' + jobId, {
                    headers: { Authorization: `${account.token}` }, 
                }).then((response) => {
                const data = response.data;
                console.log(data);
    
                if(data.status === 'Completed'){
                    console.log("Resume generation completed")
                    console.log("Interval id: " + intervalId.current)
                    clearInterval(intervalId.current);
                    setIsLoading(false);
                    setResume(data.result);
                    downloadFile(configData.API_SERVER + 'download-resume/' + jobId);
                    setJobId(null);
                }
                }).catch (error => {
                    if(error.response){
                        if(error.response.status === 401 || error.response.status === 403 ) {
        
                            dispatcher({type: LOGOUT })
                        }
                        else if(error.response.status === 404){
                            console.log("Job " +jobId + " not found")
                            console.log("Interval id: " + intervalId.current)
                            clearInterval(intervalId.current);
                            setJobId(null);
                            setIsLoading(false);
                        }
                    }
                    else {
                        console.error('Failed to fetch job status:', error);
                        setJobId(null);
                        clearInterval(intervalId.current);
                    }
                });
            }
        },5000);

        console.log("Setting interval id: " + intervalId.current)

        return () => {
            console.log("Clearing interval id: " + intervalId.current)
            clearInterval(intervalId.current);
        };
    }, [account.token, dispatcher, jobId]);

    
    const generateResume = async () => {
        
        setIsLoading(true);
        try {
            const response = await axios.post(configData.API_SERVER + 'generate-resume/'+ id, 
            {position},
            {
                headers: { Authorization: `${account.token}` }, 
            });
            const data = response.data;
            console.log("Initiated resume generation... Job id:")
            console.log(data.job_id);

            setJobId(data.job_id);
            
        } catch (error) {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403 ) {

                    dispatcher({type: LOGOUT })
                }
            }
        }
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
                            {isLoading && <p>Loading...</p>}
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={generateCover}
                                variant="contained"
                            >Generate Cover Letter</Button>
                        </Box>
                        {resume && 
                        <Box display="flex" justifyContent="center" gap="16px" p={1}>
                            <p>{resume}</p>
                        </Box>}
                    </SubCard>
                </>
            )}
        </MainCard>
    );
}

export default PositionDetails;