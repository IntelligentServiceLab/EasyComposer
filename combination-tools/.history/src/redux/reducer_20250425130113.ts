import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodeCount: 0,
};

const nodeCountReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'INCREMENT_NODE_COUNT':
      return { ...state, nodeCount: state.nodeCount + 1 };
    case 'DECREMENT_NODE_COUNT':
      return { ...state, nodeCount: state.nodeCount - 1 };
    default:
      return state;
  }
};

export default nodeCountReducer;
