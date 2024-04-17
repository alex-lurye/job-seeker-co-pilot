//TODO remove mock data and api

import { mockApi } from '../../../utils/mockApi';

const mockData = {
  resume: '',
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

const fetchResume = () => mockApi(true, mockData.resume).then((r) => r);
const updateResume = (data) => mockApi(true, data).then(() => {
 return {
   resume: data,
   keyWords: mockData.keyWords
 };
});
const fetchKeyWords = () => mockApi(true, [mockData.keyWords[0]]).then((r) => r);
const addKeyWord = (data) => mockApi(true, data).then((r) => {
  // For test
  return {
    id: new Date().toTimeString(),
    name: r,
    alias: r
  };
});
const removeKeyWord = (data) => mockApi(true, data).then((r) => r);

export {
  fetchResume,
  updateResume,
  fetchKeyWords,
  addKeyWord,
  removeKeyWord
};