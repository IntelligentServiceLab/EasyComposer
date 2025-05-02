import type { Edge, EdgeTypes } from '@xyflow/react';
import CustomEdge from './CustomEdge';

export const initialEdges: Edge[] = [
  { id: 'a->b', type: 'custom-edge',source: 'a', target: 'b', },
  { id: 'b->c',type: 'custom-edge', source: 'b', target: 'c' },
];
  // { id: 'b->e', source: 'b', sourceHandle: 'b-2',target: 'e' ,label: 'Edge 1',},
  // { id: 'c->d', type: 'custom-edge',source: 'c', target: 'd', animated: true  },
export const edgeTypes = {
  'custom-edge':CustomEdge
} satisfies EdgeTypes;
