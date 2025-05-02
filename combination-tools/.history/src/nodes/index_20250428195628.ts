import type { NodeTypes } from '@xyflow/react';
// import type { AppNode } from './types.ts';
import { PositionLoggerNode } from './PositionLoggerNode';
import { StartorEndNode } from './StartorEndNode';

export const InitialNodes = [
  {
      "id": "a",
      "type": "start-end",
      "position": {
          "x": -290,
          "y": 44
      },
      "data": {
          "label": "开始",
          "name": "输入",
          "inputs": [
              {
                  "key": "0",
                  "name": "input",
                  "text": "",
                  "type": "string",
                  "isFold": true
              }
          ]
      },
      "measured": {
          "width": 188,
          "height": 66
      }
  },
  {
      "id": "b",
      "type": "position-logger",
      "position": {
          "x": 0,
          "y": 0
      },
      "data": {
          "label": "API",
          "inputs": [
              {
                  "key": "0",
                  "name": "input",
                  "type": "string",
                  "text": "",
                  "isFold": true,
                  "value": {
                      "name": "开始",
                      "type": "string",
                      "input": "input",
                      "urlValueName": "text"
                  }
              }
          ],
          "outputs": [
              {
                  "key": "0",
                  "name": "output",
                  "isFold": true,
                  "text": "",
                  "type": "string"
              }
          ],
          "urlLine": "",
          "method": "GET"
      },
      "measured": {
          "width": 242,
          "height": 128
      }
  },


  {
      "id": "c",
      "type": "start-end",
      "position": {
          "x": 320,
          "y":44
      },
      "targetPosition": "left",
      "data": {
          "label": "结束",
          "name": "输出",
          "outputs": [
              {
                  "key": "0",
                  "name": "output",
                  "type": "string",
                  "isFold": true,
                  "value": {
                      "name": "开始",
                      "type": "string",
                      "input": "input",
                      "text": ""
                  }
              }
          ]
      },
      "measured": {
          "width": 188,
          "height": 66
      }
  }
]


// 定义节点类型
export const nodeTypes = {
  // PositionLoggerNode 是一个 React 组件，它定义了 'position-logger' 类型节点的渲染方式。
  'position-logger': PositionLoggerNode,
  'start-end': StartorEndNode
} satisfies NodeTypes;
