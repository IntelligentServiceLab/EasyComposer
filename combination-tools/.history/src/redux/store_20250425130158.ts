import { configureStore } from '@reduxjs/toolkit';
import nodeCountReducer from './reducer.ts';

const store = configureStore({
  reducer: {
    nodes: nodesReducer
  }
});


const store = createStore(nodeCountReducer);

export default store;

