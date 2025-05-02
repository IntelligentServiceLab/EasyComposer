import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './reducer.ts';

const store = configureStore({
  reducer: {
    nodes: nodesReducer
  }
});

export default store;
// src/redux/store.ts
import { createStore } from 'redux';
import nodeCountReducer from './reducer';

const store = createStore(nodeCountReducer);

export default store;

