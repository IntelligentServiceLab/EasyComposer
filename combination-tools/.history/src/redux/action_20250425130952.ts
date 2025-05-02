// src/redux/actions.ts
import { INCREMENT_NODE_COUNT, DECREMENT_NODE_COUNT } from './actionTypes';

export const incrementNodeCount = () => ({
  type: INCREMENT_NODE_COUNT,
});

export const decrementNodeCount = () => ({
  type: DECREMENT_NODE_COUNT,
});
