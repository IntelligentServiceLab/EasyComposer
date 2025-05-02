import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './reducer.ts';

const store = configureStore({
  reducer: {
    nodes: nodesReducer
  }
});

export default store;
