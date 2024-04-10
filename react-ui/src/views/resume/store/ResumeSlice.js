import { createSlice } from '@reduxjs/toolkit';

import { fetchResume, fetchKeyWords, addKeyWord, removeKeyWord } from './ResumeActions';

const ResumeSlice = createSlice({
  name: 'Resume',
  initialState: {
    resume: {
      loading: null,
      error: null,
      data: null,
    },
    keyWords: {
      loading: null,
      error: null,
      data: null,
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResume.pending, (state) => {
        state.resume.loading = true;
        state.resume.error = null;
      })
      .addCase(fetchResume.fulfilled, (state, action) => {
        state.resume.loading = false;
        state.resume.data = action.payload;
      })
      .addCase(fetchResume.rejected, (state, action) => {
        state.resume.loading = false;
        state.resume.error = action.error.message;
      })
      .addCase(fetchKeyWords.pending, (state) => {
        state.keyWords.loading = true;
        state.keyWords.error = null;
      })
      .addCase(fetchKeyWords.fulfilled, (state, action) => {
        state.keyWords.loading = false;
        state.keyWords.data = action.payload;
      })
      .addCase(fetchKeyWords.rejected, (state, action) => {
        state.keyWords.loading = false;
        state.keyWords.error = action.error.message;
      })
      .addCase(addKeyWord.pending, (state) => {
        state.keyWords.loading = true;
        state.keyWords.error = null;
      })
      .addCase(addKeyWord.fulfilled, (state, action) => {
        state.keyWords.loading = false;

        if (state.keyWords.data) {
          state.keyWords.data.push(action.payload);
        } else {
          state.keyWords.data = [action.payload];
        }

      })
      .addCase(addKeyWord.rejected, (state, action) => {
        state.keyWords.loading = false;
        state.keyWords.error = action.error.message;
      })
      .addCase(removeKeyWord.pending, (state) => {
        state.keyWords.loading = true;
        state.keyWords.error = null;
      })
      .addCase(removeKeyWord.fulfilled, (state, action) => {
        state.keyWords.loading = false;
        state.keyWords.data = state.keyWords.data.filter(({ id }) => id !== action.payload);
      })
      .addCase(removeKeyWord.rejected, (state, action) => {
        state.keyWords.loading = false;
        state.keyWords.error = action.error.message;
      });
  },
});

const { reducer } = ResumeSlice;

export default reducer;
