import React, { useState } from 'react';
import { Button, Modal, Box, TextField } from '@mui/material';
import axios from 'axios';
import configData from '../../config';
import { useDispatch, useSelector } from 'react-redux';

import { LOGOUT } from './../../store/actions';


const AddPositionModal = ({ open, handleClose }) => {

  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const account = useSelector((state) => state.account);

  const dispatcher = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault(); 
    setSubmissionSuccess(null);
    setErrorMessage('');
    axios
    .post( 
        configData.API_SERVER + 'positions', 
        { 'company': company, 'title': title, 'description': description }, 
        { headers: { Authorization: `${account.token}` }}
        )
    .then(function (response) {

        if (response.data.success) {
            console.log(response.data);
            setSubmissionSuccess(true);
        } else {
            setSubmissionSuccess(false);
            setErrorMessage('The operation was not successful. Please try again.');
        }
        handleClose(); // Close the modal after submission
    })
    .catch(function (error) {
        setSubmissionSuccess(false);
        setErrorMessage('The operation was not successful. Please try again.');
        if(error.response){
            if(error.response.status === 401 || error.response.status === 403 ) {

                dispatcher({type: LOGOUT })
            }
        }
    });
    console.log('Form submitted:', company, title, description); 
   
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw', // 80% of the viewport width
    height: '80vh', // 80% of the viewport height
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} aria-labelledby={"blabla"}>
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              label="Company Name" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <TextField 
              margin="normal" 
              required 
              fullWidth 
              label="Position Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline // For a multiline description field
              rows={22} 
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Save
            </Button>
          </form>
          {submissionSuccess && <p style={{ color: 'green' }}>Settings saved successfully!</p>}
          {submissionSuccess === false && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Box>
      </Modal>
    </div>
  );
}

export default AddPositionModal; 