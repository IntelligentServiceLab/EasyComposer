import type { NodeTypes } from '@xyflow/react';
// import type { AppNode } from './types.ts';
import { PositionLoggerNode } from './PositionLoggerNode';
import { StartorEndNode } from './StartorEndNode';

export const InitialNodes = [
    {
        "id": "a",
        "data": {
            "name": "输入",
            "label": "开始",
            "inputs": [
                {
                    "key": "0",
                    "name": "input",
                    "text": "Ce mai faci?",
                    "type": "string",
                    "isFold": false
                }
            ]
        },
        "type": "start-end",
        "measured": {
            "width": 187,
            "height": 65
        },
        "position": {
            "x": -290,
            "y": 44
        },
        "selected": false
    },
    {
        "id": "b",
        "data": {
            "label": "API",
            "inputs": [
                {
                    "key": "0",
                    "name": "input",
                    "text": "这里是结果",
                    "type": "string",
                    "value": {
                        "name": "开始",
                        "type": "string",
                        "input": "input",
                        "urlValueName": "q"
                    },
                    "isFold": false
                }
            ],
            "method": "POST",
            "outputs": [
                {
                    "key": "0",
                    "name": "output",
                    "text": "这里是结果",
                    "type": "string",
                    "isFold": true
                },
                {
                    "key": "key-1745839500872",
                    "name": "output2",
                    "text": "这里是描述",
                    "isFold": true,
                    "type": "string"
                },
                {
                    "key": "key-1745839501232",
                    "name": "output3",
                    "text": "这里是描述",
                    "isFold": true,
                    "type": "string"
                }
            ],
            "urlLine": "https://google-translator9.p.rapidapi.com/v2/detect"
        


// 定义节点类型
export const nodeTypes = {
  // PositionLoggerNode 是一个 React 组件，它定义了 'position-logger' 类型节点的渲染方式。
  'position-logger': PositionLoggerNode,
  'start-end': StartorEndNode
} satisfies NodeTypes;
