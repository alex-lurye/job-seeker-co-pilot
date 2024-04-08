import React from 'react';

import { makeStyles } from '@material-ui/styles';

import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

const useStyles = makeStyles(() => ({
  title: {
    fontSize: '1rem',
    textAlign: 'center',
  },
  footer: {
    display: 'flex',
    padding: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

const Confirm = ({ open, title, cancelText, submitText, onCancel, onSubmit }) => {
  const classes = useStyles();

  return (
    <Dialog
      maxWidth="xs"
      open={open}
      onClose={() => console.log('e')}
    >
      <DialogTitle dangerouslySetInnerHTML={{ __html: title }} className={classes.title} />
      <div className={classes.footer}>
        <div>
          <Button onClick={onCancel} >{ cancelText }</Button>
        </div>
        <div>
          <Button onClick={onSubmit} variant="contained">{ submitText }</Button>
        </div>
      </div>
    </Dialog>
  );
};

Confirm.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  submitText: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


export default Confirm;