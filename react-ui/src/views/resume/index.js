import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import SubCard from '../../ui-component/cards/SubCard';
import ConfirmModal from '../../ui-component/confirmModal';
import BaseLayout from '../../layout/BaseLayout';
import KeyWords from '../../features/keyWords';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { fetchKeyWords, fetchResume, addKeyWord, removeKeyWord } from './store/ResumeActions';
import { getKeyWords } from './store/ResumeSelector';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(() => ({
  keyWordsLoadingContainer: {
    margin: '1rem',
    textAlign: 'center'
  },
  keyWordsBlock: {
    marginTop: '1rem'
  },
  keyWordsControllerContainer: {
    display: 'flex',
    marginBottom: '1rem'
  },
  keyWordsAddedButton: {
    minWidth: '10rem',
    marginLeft: '1rem'
  }
}));

const config = {
  confirm: {
    title: 'This will replace the current keywords that already exist in&nbsp;the Keyword section below',
    cancelText: 'Cancel',
    submitText: 'Generate keywords'
  }
};

function Resume() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: dataKeyWords, loading: loadingKeywords } = useSelector(getKeyWords);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resumeDescription, setResumeDescription] = useState('');
  const [keyWordInput, setKeyWordInput] = useState('');

  const handleChangeResumeDescription = (event) => {
    setResumeDescription(event.target.value);
  };

  const handleChangeKeyWordInput = (event) => {
    setKeyWordInput(event.target.value);
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleHideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleAddedKeyWord = (keyWord) => {
    dispatch(addKeyWord(keyWord));
    setKeyWordInput('');
  };

  const handleRemoveKeyWord = (keyWord) => {
    dispatch(removeKeyWord(keyWord));
  };

  const generateTags = () => {
    handleHideConfirmModal();
  };

  useEffect(() => {
    dispatch(fetchKeyWords());
    dispatch(fetchResume());
  }, []);

  return (
    <BaseLayout title="Resume">
      <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <SubCard>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={6} md={3}>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="Resume"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={20}
                      value={resumeDescription}
                      onChange={handleChangeResumeDescription}
                      placeholder="Description of duties and accomplishments"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button onClick={handleShowConfirmModal} variant="contained">Generate keywords</Button>
                  </Grid>
                </Grid>
              </SubCard>

              <SubCard className={classes.keyWordsBlock}>
                <div className={classes.keyWordsControllerContainer}>
                  <TextField
                    name="Skills"
                    variant="outlined"
                    fullWidth
                    value={keyWordInput}
                    onChange={handleChangeKeyWordInput}
                    placeholder="Added some skills"
                  />
                  <Button className={classes.keyWordsAddedButton} onClick={() => handleAddedKeyWord(keyWordInput)} variant="contained">Added keyword</Button>
                </div>
                { loadingKeywords ? <div className={classes.keyWordsLoadingContainer}>
                  <CircularProgress/>
                </div> : '' }
                { dataKeyWords?.length ? <KeyWords
                  list={dataKeyWords}
                  onClick={(keyWord) => console.log('keyWord', keyWord)}
                  onRemove={(keyWord) => handleRemoveKeyWord(keyWord)}
                /> : '' }
              </SubCard>
            </Grid>
          </Grid>
        <ConfirmModal
          title={config.confirm.title}
          cancelText={config.confirm.cancelText}
          submitText={config.confirm.submitText}
          open={showConfirmModal}
          onCancel={handleHideConfirmModal}
          onSubmit={generateTags}
        />
      </>
    </BaseLayout>
  );
}

export default Resume;