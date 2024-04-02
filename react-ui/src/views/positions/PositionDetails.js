import React from 'react';
import {useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import configData from '../../config';
import { LOGOUT } from '../../store/actions';
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

    const [job, setJob] = useState( {
        jobId: '',
        jobType: '',
    });
//    const [jobId, setJobId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
//    const [resume, setResume] = useState(null); 
//     const [summary, setSummary] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [draft, setDraft] = useState(null);

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
            a.download = 'resume.docx'; // Provide a filename here
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
 
                        dispatcher({type: LOGOUT });
                    }
                }
                console.error('Failed to fetch positions:', error);
                // Handle error appropriately
            }
        };

        fetchData();
    });

    var intervalId = useRef(null);

    useEffect(() => {

        if (!job.jobId) {
            if(intervalId.current) { 
                clearInterval(intervalId.current); intervalId.current = null; 
            } 
            return;
        }

        intervalId.current = setInterval(() => {

            console.log('Checking job status...');
            console.log('Job id: ' + job.jobId);
            if (job.jobId) {
                
                axios.get(configData.API_SERVER + 'generation-status/' + job.jobId, {
                    headers: { Authorization: `${account.token}` }, 
                }).then((response) => {
                const data = response.data;
                console.log(data);
    
                if(data.status === 'Completed'){
                    console.log('Job completed: ' + job.jobId);
                    console.log('Interval id: ' + intervalId.current);
                    clearInterval(intervalId.current);
                    setIsLoading(false);
                    console.log(data.result);
                    if(job.jobType === 'RESUME'){
                        downloadFile(configData.API_SERVER + 'download-resume/' + job.jobId);
                    }
                    else if(job.jobType === 'SUMMARY'){
                        setDraft(data.result);
                        setPrompt(null);
                    }
                    setJob({jobId: null, jobType: null});
                }
                }).catch (error => {
                    if(error.response){
                        if(error.response.status === 401 || error.response.status === 403 ) {
        
                            dispatcher({type: LOGOUT });
                        }
                        else if(error.response.status === 404){
                            console.log('Job ' +job.jobId + ' not found');
                            console.log('Interval id: ' + intervalId.current);
                            clearInterval(intervalId.current);
                            setJob({jobId: null, jobType: null});
                            setIsLoading(false);
                        }
                    }
                    else {
                        console.error('Failed to fetch job status:', error);
                        setJob({jobId: null, jobType: null});
                        clearInterval(intervalId.current);
                    }
                });
            }
        },5000);

        console.log('Setting interval id: ' + intervalId.current);

        return () => {
            console.log('Clearing interval id: ' + intervalId.current);
            clearInterval(intervalId.current);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account.token, dispatcher, job.jobId]);

    
    const generateResume = async () => {
        
        setIsLoading(true);
        try {
            const response = await axios.post(configData.API_SERVER + 'generate-resume/'+ id, 
            {position},
            {
                headers: { Authorization: `${account.token}` }, 
            });
            const data = response.data;
            console.log('Initiated resume generation... Job id:');
            console.log(data.job_id);

            setJob({jobId: data.job_id, jobType:'RESUME'});
            
        } catch (error) {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403 ) {

                    dispatcher({type: LOGOUT });
                }
            }
        }
    };

    const generateSummary = async () => {
            
            setIsLoading(true);
            try {
                const response = await axios.post(configData.API_SERVER + 'generate-summary/'+ id, 
                {draft: draft, prompt: prompt},
                {
                    headers: { Authorization: `${account.token}` }, 
                });
                const data = response.data;
                console.log('Initiated summary generation... Job id:');
                console.log(data.job_id);
    
                setJob({jobId: data.job_id, jobType:'SUMMARY'});
            } catch (error) {
                if(error.response){
                    if(error.response.status === 401 || error.response.status === 403 ) {
    
                        dispatcher({type: LOGOUT });
                    }
                }
                setIsLoading(false);
            }
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
                        
                        <TextField
                                fullWidth
                                multilin
                                label="Professional summary"
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                variant="outlined"
                                sx={{
                                '& .MuiInputBase-inputMultiline': {
                                    height: '200px', 
                                    overflow: 'auto',
                                },
                                }}
                            />
                        <Box display="flex" justifyContent="center" gap="16px" p={1}>
                            <TextField 
                                margin="normal"
                                fullWidth 
                                label="Feedback prompt" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={generateSummary}
                                variant="contained"
                            >Generate Professional Summary</Button>
                        </Box>
                        <Box display="flex" justifyContent="center" gap="16px" p={1}>
                            <Button
                                startIcon={<AddCircleOutlineIcon />}
                                onClick={generateResume}
                                variant="contained"
                            >Generate Resume</Button>
                            {isLoading && <p>Loading...</p>}
                        </Box>
                    </SubCard>
                </>
            )}
        </MainCard>
    );
};

export default PositionDetails;
