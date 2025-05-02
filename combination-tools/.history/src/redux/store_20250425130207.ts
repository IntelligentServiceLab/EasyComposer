import { configureStore } from '@reduxjs/toolkit';
import nodeCountReducer from './reducer.ts';

const store = configureStore({
  reducer: {
    nodes: nodeCountReducer
  }
});


const store = createStore(nodeCountReducer);

export default store;

