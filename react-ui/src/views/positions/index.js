import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@material-ui/styles';
import { Box, Card, Grid, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import axios from 'axios';

// project imports

import MainCard from '../../ui-component/cards/MainCard';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
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
    const [formSubmitted,setFormSubmitted] = useState(false);

    const handleOpen = () => { setOpen(true); setFormSubmitted(false);}
    const handleClose = () => { setOpen(false); setFormSubmitted(true);}

    const account = useSelector((state) => state.account);

    const dispatcher = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(configData.API_SERVER + 'positions', {
                    headers: { Authorization: `${account.token}` }, // Assuming you need to authorize
                });
                const data = response.data;
                console.log(data);
                setPositions(data || []);
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
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}> 
                <Button variant="contained" onClick={handleOpen}>
                    Add New Position
                </Button>
                <AddPositionModal open={open} handleClose={handleClose} />
            </Box>

        </MainCard>
    )
};

export default Positions;