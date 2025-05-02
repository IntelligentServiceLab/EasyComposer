// src/redux/store.ts
import { createStore } from 'redux';
import nodeCountReducer from './reducer';

const store = createStore(nodeCountReducer);

export default store;
