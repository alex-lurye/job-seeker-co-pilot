// import PropTypes from 'prop-types';
import React from 'react';

// material-ui
// import { useTheme } from '@material-ui/styles';
import { Box, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import axios from 'axios';

// project imports

import MainCard from '../../ui-component/cards/MainCard';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPositionModal from './AddPositionModal';
import configData from '../../config';
import { LOGOUT } from './../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Positions = () => {
    const [positions, setPositions] = useState([{
        id:'',
        company:'',
        title:'',
        description:'',
        date: ''
    }]);


    const [open, setOpen] = useState(false);
    const [,setFormSubmitted] = useState(false);

    const handleOpen = () => { setOpen(true); setFormSubmitted(false);};
    const handleClose = () => { setOpen(false); setFormSubmitted(true);};

    const account = useSelector((state) => state.account);

    const dispatcher = useDispatch();

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(configData.API_SERVER + 'positions/' + id, {
                headers: { Authorization: `${account.token}` }, // Assuming you need to authorize
            });
            const data = response.data;
            console.log(data);
            setPositions(positions.filter((position) => position.id !== id));
        } catch (error) {
            if(error.response){
                if(error.response.status === 401 || error.response.status === 403 ) {

                    dispatcher({type: LOGOUT });
                }
            }
            console.error('Failed to delete position:', error);
            // Handle error appropriately
        }
    };

    const addPosition = (newPosition) => {
        setPositions(prevPositions => [...prevPositions, newPosition]);
        handleClose();
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(configData.API_SERVER + 'positions', {
                    headers: { Authorization: `${account.token}` },
                });
                const data = response.data;
                console.log(data);
                setPositions(data || []);
            } catch (error) {
                if(error.response){
                    if(error.response.status === 401 || error.response.status === 403 ) {
 
                        dispatcher({type: LOGOUT });
                    }
                }
                console.error('Failed to fetch positions:', error);
            }
        };

        fetchData();

    }, []);


    return (
        <MainCard title="Positions">
            <List>
                {positions.map((position, index) => (
                    <Link to={`/positions/${position.id}`} key={position.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem key={index} alignItems="flex-start" sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}> 
                            <ListItemText
                                primary={position.title}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            {position.company} 
                                        </Typography>
                                        {` - ${position.date}`} 
                                    </React.Fragment>
                                }
                            />
                            <IconButton type="button" aria-label="delete"
                            onClick={(e) => {
                                e.preventDefault(); 
                                handleDelete(position.id); 
                            }}
                            sx={{ minWidth: 'auto', padding: 1 }}
                            >
                            <DeleteIcon /> 
                        </IconButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}> 
                <Button variant="contained" onClick={handleOpen}>
                    Add New Position
                </Button>
                <AddPositionModal open={open} handleSubmit={addPosition} handleClose={handleClose} />
            </Box>

        </MainCard>
    );
};

export default Positions;