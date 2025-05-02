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
            "inputs": [
                {
                    "key": "0",
                    "name": "input",
                    "type": "string",
                    "text": "Ce mai faci?",
                    "isFold": "false",
                    "value": null
                }
            ],
            "outputs": null,
            "urlLine": null,
            "method": null
        },
        "measured": {
            "width": 187,
            "height": 62
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
                    "text": "这里是结果",
                    "isFold": "false",
                    "value": {
                        "name": "开始",
                        "input": "input",
                        "type": "string",
                        "urlValueName": "q",
                        "text": null
                    }
                }
            ],
            "outputs": [
                {
                    "key": "0",
                    "name": "output",
                    "idFold": null,
                    "text": "false",
                    "type": "string",
                    "value": null
                },
                {
                    "key": "key-1745839500872",
                    "name": "output2",
                    "idFold": null,
                    "text": "1",
                    "type": "string",
                    "value": null
                },
                {
                    "key": "key-1745839501232",
                    "name": "output3",
                    "idFold": null,
                    "text": "ro",
                    "type": "string",
                    "value": null
                }
            ],
            "urlLine": "https://google-translator9.p.rapidapi.com/v2/detect",
            "method": "POST"
        },
        "measured": {
            "width": "241",
            "height": "178"
        },
        "selected": false
    },
    {
        "id": "c",
        "type": "start-end",
        "position": {
            "x": 320,
            "y": 44
        },
        "data": {
            "label": "结束",
            "inputs": null,
            "outputs": [
                {
                    "key": "0",
                    "name": "output",
                    "idFold": null,
                    "text": null,
                    "type": "number",
                    "value": {
                        "name": "开始",
                        "input": "input",
                        "type": "string",
                        "urlValueName": null,
                        "text": "Ce mai faci?"
                    }
                },
                {
                    "key": "key-1745839507480",
                    "name": "output2",
                    "idFold": null,
                    "text": null,
                    "type": "string",
                    "value": {
                        "name": "API",
                        "input": "output3",
                        "type": "string",
                        "urlValueName": null,
                        "text": "ro"
                    }
                }
            ],
            "urlLine": null,
            "method": null
        },
        "measured": {
            "width": 187,
            "height": 62
        },
        "selected": true
    }
]

// 定义节点类型
export const nodeTypes = {
  // PositionLoggerNode 是一个 React 组件，它定义了 'position-logger' 类型节点的渲染方式。
  'position-logger': PositionLoggerNode,
  'start-end': StartorEndNode
} satisfies NodeTypes;
