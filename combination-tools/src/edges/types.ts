import type { Edge, BuiltInEdge } from '@xyflow/react';

export type CustomEdge = Edge<{ label: string }, 'custom'>;
export type AppEdge = BuiltInEdge | CustomEdge;
