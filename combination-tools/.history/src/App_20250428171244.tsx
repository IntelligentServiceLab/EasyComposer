import { useState, useCallback, useEffect, useRef } from 'react';

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  type OnConnect,
} from '@xyflow/react'
import { Button, Drawer, Modal, Input, Flex, Typography, message } from 'antd';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { InitialNodes } from './nodes/index';
import { initialEdges } from './edges/index';
import { AppNode } from './nodes/types';
import eventBus from './nodes/eventBus.ts';
import { PositionLoggerNode } from './nodes/types.ts'
// import eventBusEdge from './edges/eventBusEdges.ts';
import { eventAddNode } from './common.ts'
import { baseURL } from './common.ts'
import axios from 'axios';
const TextArea = Input.TextArea;

const { Paragraph } = Typography;

// import { AppEdge } from './edges/types'; 
const flowKey = 'example-flow';
const getNodeId = () => `randomnode_${+new Date()}`;
const getMesId = () => `nodeAndEdge_${+new Date()}`;

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(InitialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);
  const { getNodes, getEdges, setViewport, toObject } = useReactFlow();
  const [open, setOpen] = useState(false); // 控制遮罩层

  const [mesId, setMesId] = useState(''); // 控制遮罩层
  const [isModalOpen, setIsModalOpen] = useState(false); // 控制导入模态框
  const [mesId2, setMesId2] = useState('');
  const [isModalOpen2, setIsModalOpen2] = useState(false); // 控制导出模态框

  const [messageApi, contextHolder] = message.useMessage();

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: 'custom-edge' };
      setEdges((eds) => addEdge(edge, eds));
      eventBus.emit('dataUpdated',{
        nodes: nodes,
        edges: [...getEdges(), edge]
      });
    },
    [setEdges]
  );

  const onUpload = async () => {
    const FinalNodes = getNodes();
    const FinalEdges = getEdges();
    const message = {
      id: getMesId(), // 这里随机生成的ID需要抛给用户记住
      res: JSON.stringify({
        nodes: FinalNodes,
        edges: FinalEdges
      })
    }
    setMesId2(message.id);
    setIsModalOpen2(true);

    console.log(message);

    const res = await axios.post(`${baseURL}/export`, message);
    
    console.log(res);
  }



  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = toObject();
      console.log(flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) ?? '{}');
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };
    restoreFlow();
  }, [setNodes, setViewport]);



  /*
  ** 添加Node
  */
  type edgeObjType = {
    randomId: string,
    edgeId: string,
    source: string,
    target: string
  }
  const [nodeCount, setNodeCount] = useState(1);
  const nodeCountRef = useRef(nodeCount); // 保存nodeCount的值
  useEffect(() => {
    nodeCountRef.current = nodeCount;
  }, [nodeCount]);
  useEffect(() => {
    const handleAddNode = (edgeObj: edgeObjType) => onAdd(edgeObj);
    eventAddNode.on('addNode', handleAddNode);
    return () => {
      eventAddNode.off('addNode', handleAddNode);
    }
  }, [])
  const onAdd = (edgeObj: edgeObjType) => {
    const {
      randomId,
      edgeId,
      source,
      target
    } = edgeObj;
    const newNode: PositionLoggerNode = {
      id: randomId,
      data: {
        label: `API${nodeCountRef.current}`,
        inputs: [
          {
            key: "0",
            name: "input",
            type: "string",
            text: "",
            isFold: true,
            value: {
              name: "",
              type: "",
              input: "",
              text: '',
              urlValueName: ""
            }
          }
        ],
        outputs: [{
          key: "0",
          name: "output",
          isFold: true,
          text: "",
          type: "string"
        }],
        urlLine: '',
        method: 'POST'
      },
      type: 'position-logger',
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };

    if (source && target) {
      let nodes = getNodes();
      const filteredEdges = getEdges().filter((edge) => edge.id !== edgeId);
      const left = { id: `edgesL_${+new Date()}`, type: 'custom-edge', source: source, target: randomId }
      const right = { id: `edgesR_${+new Date()}`, type: 'custom-edge', source: randomId, target: target }

      // 使用setXxx更新节点无法立即获取最新值，故在此处做暂存
      nodes = [...nodes, newNode]
      const finanlEdges = [...filteredEdges, left, right];
      setNodes((nds) => [...nds, newNode]);
      setEdges(finanlEdges);

      // 更新节点的位置
      const sourceNode = nodes.find((node) => node.id === source);
      const targetNode = nodes.find((node) => node.id === target);
      if (sourceNode && targetNode) {
        // const sourcePosition = sourceNode.position;
        // const targetPosition = targetNode.position;
        newNode.position = {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        }

        const randomNode = nodes.find((node) => node.id === randomId);
        if (randomNode) {
          const randomNodePosition = randomNode.position;
          setNodes(nodes.map((node) => {
            if (node.id === randomId) {
              return node;
            }
            if (node.position.x < randomNodePosition.x) {
              node.position = {
                x: node.position.x - 200,
                y: node.position.y,
              };
            } else {
              node.position = {
                x: node.position.x + 200,
                y: node.position.y,
              };
            }
            return node;
          }));
        }
      } else {
        message.error('未找到源节点或目标节点');
      }
      eventBus.emit('dataUpdated',{
        nodes: nodes,
        edges: finanlEdges
      });
    } else {
      setNodes((nds) => [...nds, newNode]);
      eventBus.emit('dataUpdated',{
        nodes: [...getNodes(), newNode],
        edges: getEdges()
      });
    }
    setNodeCount((prevCount) => prevCount + 1);
  }


  const handleInit = (reactFlowInstance: any) => {
    setRfInstance(reactFlowInstance);
  };

  const onExecute = async () => {
    // const sortedNodes = findNodeOrder(getNodes(), getEdges());
    // setNodes(sortedNodes);
    const EdgesAndNodes = {
      nodes: getNodes(),
      edges: getEdges()
    }
    console.log(EdgesAndNodes.nodes);
    

    try {
      messageApi.open({
        type: 'loading',
        content: '运行中...',
        duration: 0,
      });
      const res: { code: number, data: AppNode[] } = await axios.post(`${baseURL}/url`, EdgesAndNodes, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // if (res) {
        setNodes(res.data)
        eventBus.emit('dataUpdated',{
          nodes: res.data,
          edges: getEdges()
        });
        message.success('执行成功');
      // } else {
      //   messageApi.open({ type: 'error', content: '执行失败' });
      // }
      setTimeout(messageApi.destroy, 1000);
    } catch (error) {

      messageApi.open({
        type: 'error',
        content: '执行失败',
      });
      if (axios.isAxiosError(error)) {
        // 如果是axios的错误，可以访问error.response、error.request等属性
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      setTimeout(messageApi.destroy, 1000);
    }
  }
  const updateItem = (key: string, value: string) => {
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === 'a') {
        node.data?.inputs?.map((item: any) => {
          if (item.key == key) {
            if (value !== undefined) {
              item.text = value;
            }
          }
        })
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }
  const getHeight = (text: string | undefined) => {
    return text ?  22 + 22 * text.length / 25 : 20;
}

  const onClose = () => {
    setOpen(false);
  };


  const handleOk = async () => {
    messageApi.open({
      type: 'loading',
      content: '正在导入...',
      duration: 0
    })
    try {

    } catch {

    }
    
    setMesId('');
    messageApi.open({
      type: 'success',
      content: '导入成功!',
    })
    setTimeout(messageApi.destroy, 1000);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setMesId('');
    setIsModalOpen(false);
  };


  const handleOk2 = async () => {
    try {
      await navigator.clipboard.writeText(mesId2);
      setMesId2('');
      setIsModalOpen2(false);
      messageApi.open({
        type: 'success',
        content: 'ID 已复制!',
      });
      // console.log(mesId2);

    } catch (err) {
      messageApi.open({
        type: 'error',
        content: '复制失败，请手动复制。',
      });
    }
  };

  const handleCancel2 = () => {
    setMesId2('');
    setIsModalOpen2(false);
  };

  return (
    <ReactFlow
      id="flow"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      nodeTypes={nodeTypes}
      onEdgesChange={onEdgesChange}
      edgeTypes={edgeTypes}
      onConnect={onConnect}
      onInit={handleInit}
      fitView
      fitViewOptions={{ padding: 1 }}
      style={{ backgroundColor: "#F7F9FB" }}
    >
      {contextHolder}
      <Background />

      <Panel className='top-left' position="top-left">
        <Button onClick={onUpload}>导出</Button>
        <Button onClick={() => setIsModalOpen(true)}>导入</Button>
        <Button >打包</Button>
      </Panel>
      <Panel className='top-right' position="top-right">
        <Button onClick={onSave}>保存</Button>
        <Button onClick={onRestore}>撤回</Button>
        <Button onClick={() => onAdd(
          {
            randomId: getNodeId(),
            target: '',
            source: '',
            edgeId: '',
          }
        )}>添加节点</Button>
        <Button onClick={() => setOpen(true)}>执行</Button>
      </Panel>
      <Drawer title="试运行" onClose={onClose} open={open}>

        <Button style={{ position: 'absolute', top: '80px', right: '40px' }} type="primary" onClick={onExecute}>执行</Button>
        <h3 style={{ margin: '0', padding: '0' }}>试运行输入</h3>
        {getNodes().map((data) => {
          if (data.id == 'a') {
            return (data?.data?.inputs as Array<any>).map((item, index) => {
              return <Flex wrap key={index} >
                <span style={{ margin: '5px 6px 3px 0', fontSize: '16px' }}>{item?.name}</span>
                <span style={{ color: 'gray', margin: '5px 6px 3px 0', fontSize: '16px' }}>{item?.type} </span>
                <TextArea style={{ width: '400px', marginLeft: '4px',height:getHeight(item?.text)  }} value={item?.text} onChange={(e) => {
                  updateItem(item.key, e.target.value)
                }} />
              </Flex>
            })
          }
        })}
        <h3 style={{ margin: '10px 0 0 0', padding: '0' }}>输出结果</h3>

        {getNodes().map((data) => {
          if (data.id == 'c') {
            return (data?.data?.outputs as Array<any>).map((item, index) => {
              return <Flex wrap key={index} >
                <span style={{ margin: '5px 6px 3px 0', fontSize: '16px' }}>{item?.name}</span>
                <span style={{ color: 'gray', margin: '5px 6px 3px 0', fontSize: '16px' }}>{item?.type} </span>
                <TextArea disabled style={{ width: '400px', marginLeft: '4px',height:getHeight(item?.value?.text) }} value={item?.value?.text} />
              </Flex>
            })
          }
        })}




      </Drawer>
      <Modal title="导入ID" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input value={mesId} placeholder="请输入导入的ID" onChange={(e) => setMesId(e.target.value)} />
      </Modal>
      <MiniMap />

      <Modal title="请记住这个ID！" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}>
        <Paragraph copyable={{ text: mesId2 }}>{mesId2}</Paragraph>
      </Modal>
      <Controls />
    </ReactFlow>
  );
};

export default function App() {
  return (
    <div className='container'>
      <ReactFlowProvider >
        <SaveRestore />
      </ReactFlowProvider>
    </div>
  );
}