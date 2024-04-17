import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  fetchResume as fetchResumeApi,
  updateResume as updateResumeApi,
  fetchKeyWords as fetchKeyWordsApi,
  addKeyWord as addKeyWordApi,
  removeKeyWord as removeKeyWordApi
} from '../../../api';

const fetchResume = createAsyncThunk(
  'resume/fetchResume',
  async (payload, { rejectWithValue }) => {
    try {
      return await fetchResumeApi();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const updateResume = createAsyncThunk(
  'resume/updateResume',
  async (payload, { rejectWithValue }) => {
    try {
      return await updateResumeApi(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const fetchKeyWords = createAsyncThunk(
  'resume/fetchKeyWords',
  async (payload, { rejectWithValue }) => {
    try {
      return await fetchKeyWordsApi();
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const addKeyWord = createAsyncThunk(
  'resume/addKeyWord',
  async (payload, { rejectWithValue }) => {
    try {
      return await addKeyWordApi(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const removeKeyWord = createAsyncThunk(
  'resume/removeKeyWord',
  async (payload, { rejectWithValue }) => {
    try {
      await removeKeyWordApi(payload);
      return payload.id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export { fetchResume, updateResume, fetchKeyWords, addKeyWord, removeKeyWord };
