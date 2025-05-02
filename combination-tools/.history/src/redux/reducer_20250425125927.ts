import { createSlice } from '@reduxjs/toolkit';
// import {InitialNodes} from './state.ts'
const initialState = {
  nodeCount: 0,
};

const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes(state, action) {
      state.nodes = action.payload;
    },
    updateNode(state:any, action:any) {
      const index = state.nodes.findIndex((node:any) => node.id === action.payload.id);
      if (index !== -1) {
        state.nodes[index] = { ...state.nodes[index], ...action.payload };
      }
    },
    addNode(state:any, action:any) {
      state.nodes.push(action.payload);
    },
    removeNode(state:any, action:any) {
      state.nodes = state.nodes.filter((node:any) => node.id !== action.payload);
    }
  }
});

export const { setNodes, updateNode, addNode, removeNode } = nodesSlice.actions;

export default nodesSlice.reducer;
