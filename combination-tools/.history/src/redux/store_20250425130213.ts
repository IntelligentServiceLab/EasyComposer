import { configureStore } from '@reduxjs/toolkit';
import nodeCountReducer from './reducer.ts';

const store = configureStore({
  reducer: {
    nodeCount: nodeCountReducer
  }
});


const store = createStore(nodeCountReducer);

export default store;

