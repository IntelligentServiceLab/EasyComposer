import type { NodeTypes } from '@xyflow/react';
// import type { AppNode } from './types.ts';
import { PositionLoggerNode } from './PositionLoggerNode';
import { StartorEndNode } from './StartorEndNode';

export const InitialNodes = 


// 定义节点类型
export const nodeTypes = {
  // PositionLoggerNode 是一个 React 组件，它定义了 'position-logger' 类型节点的渲染方式。
  'position-logger': PositionLoggerNode,
  'start-end': StartorEndNode
} satisfies NodeTypes;
