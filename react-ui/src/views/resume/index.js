import React, { useState } from 'react';

import SubCard from '../../ui-component/cards/SubCard';
import ConfirmModal from '../../ui-component/confirmModal';
import BaseLayout from '../../layout/BaseLayout';
import KeyWords from '../../features/keyWords';
import TextField from '@material-ui/core/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const config = {
  confirm: {
    title: 'This will replace the current keywords that already exist in&nbsp;the Keyword section below',
    cancelText: 'Cancel',
    submitText: 'Generate keywords'
  }
};

const mock = {
  keyWords: [
    {
      id: '1',
      name: 'React',
      alias: 'react',
    },
    {
      id: '2',
      name: 'JavaScript',
      alias: 'javascript',
    },
    {
      id: '3',
      name: 'HTML',
      alias: 'html',
    },
    {
      id: '4',
      name: 'CSS',
      alias: 'css',
    },
    {
      id: '5',
      name: 'TypeScript',
      alias: 'typescript',
    },
    {
      id: '6',
      name: 'Redux',
      alias: 'redux',
    },
    {
      id: '7',
      name: 'Vue.js',
      alias: 'vuejs',
    },
    {
      id: '8',
      name: 'Angular',
      alias: 'angular',
    },
    {
      id: '9',
      name: 'Webpack',
      alias: 'webpack',
    },
    {
      id: '10',
      name: 'Babel',
      alias: 'babel',
    },
  ]
};

function Resume() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resumeDescription, setResumeDescription] = useState('');

  const getKeyWords = mock.keyWords;

  const handleChangeResumeDescription = (event) => {
    setResumeDescription(event.target.value);
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleHideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const generateTags = () => {
    handleHideConfirmModal();
  };

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
              { getKeyWords.length ? <SubCard style={{ marginTop: '1rem' }}>
                <KeyWords
                  list={getKeyWords}
                  onClick={(keyWord) => console.log('keyWord', keyWord)}
                  onRemove={(keyWord) => console.log('remove keyWord', keyWord)}
                />
              </SubCard> : '' }
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