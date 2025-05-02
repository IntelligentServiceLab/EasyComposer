import {
    increment
  } from "./redux/reducer";
  import { store } from './redux/store.ts';
  import { Provider, useDispatch, useSelector } from 'react-redux';
  
  <Provider store={store}></Provider>