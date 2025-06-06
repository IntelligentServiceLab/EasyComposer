import { useState, useCallback, useEffect } from 'react';
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
import { Button, Drawer, Modal, Input, Flex, Typography,message } from 'antd';
import '@xyflow/react/dist/style.css';
import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { InitialNodes } from './nodes/index';
import { initialEdges } from './edges/index';
import { AppNode } from './nodes/types';
import eventBus from './nodes/eventBus.ts';
import { PositionLoggerNode } from './nodes/types.ts'
import eventBusEdge from './edges/eventBusEdges.ts';
import { baseURL, findNodeOrder } from './common.ts'
import axios from 'axios';

const { Paragraph, Text } = Typography;

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
  // useEffect(() => {
  //   eventBusEdge.emit('edgeUpdate',getEdges);
  //   eventBus.on('dataUpdated', getNodes);
  // }, [])

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const edge = { ...connection, type: 'custom-edge' };
      setEdges((eds) => addEdge(edge, eds));
      eventBus.emit('dataUpdated');
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
    // console.log(res);
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


  const [nodeCount, setNodeCount] = useState(1);
  const onAdd = async () => {
    const newNode: PositionLoggerNode = {
      id: getNodeId(),

      data: {
        label: `API${nodeCount}`,
        inputs: [
          {
            key: "0",
            name: "input",
            type: "string",
            text: "",
            isFold: true,
            value: {
              name: "API",
              type: "string",
              input: "output",
              text: '',
              urlValueName: "text"
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
        urlLine: 'https://chatgpt-42.p.rapidapi.com/aitohuman',
        method: 'POST'
      },
      type: 'position-logger',
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
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

    // const res = await axios.post(`${baseURL}/url`, EdgesAndNodes, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    if(resizeBy.code === 200){}
    // setNodes(res.data)
  }

  const onClose = () => {
    setOpen(false);
  };


  const handleOk = async () => {
    const result = await axios.get(`${baseURL}/import?mesId=${mesId}`);
    console.log(result);
    const { nodes, edges } = result.data;
    setNodes(nodes);
    setEdges(edges);
    setMesId('');
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
      console.log(mesId2);
      
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
      // fitViewOptions={{ padding: 1 }}
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
        <Button onClick={onAdd}>添加节点</Button>
        <Button onClick={() => setOpen(true)}>执行</Button>
      </Panel>
      <Drawer title="试运行" onClose={onClose} open={open}>

      <Button style={{ position: 'absolute', top: '80px', right: '40px' }} type="primary" onClick={onExecute}>执行</Button>
        <h3 style={{margin:'0',padding:'0'}}>试运行输入</h3>
        {getNodes().map((data) => {
          if (data.id == 'a') {
            return (data?.data?.inputs as Array<any>).map((item, index) => {
              return <Flex wrap key={index} >
                <span style={{ margin: '2px 6px 2px 0', fontSize: '16px' }}>{item?.name}</span>
                <span style={{ color: 'gray', margin: '2px 6px 2px 0', fontSize: '16px' }}>{item?.type} </span>
                <Input style={{ width: '400px', marginLeft: '4px' }} value={item?.text} />
              </Flex>
            })
          }
        })}
         <h3 style={{margin:'10px 0 0 0',padding:'0'}}>输出结果</h3>
        
        {getNodes().map((data) => {
          if (data.id == 'c') {
            return (data?.data?.outputs as Array<any>).map((item, index) => {
              return <Flex wrap key={index} >
                <span style={{margin: '2px 6px 2px 0', fontSize: '16px' }}>{item?.name}</span>
                <span style={{ color: 'gray', margin: '2px 6px 2px 0', fontSize: '16px' }}>{item?.type} </span>
                <Input disabled style={{ width: '400px', marginLeft: '4px' }} value={item?.value.text} />
              </Flex>
            })
          }
        })}


       

      </Drawer>
      <Modal title="导入ID" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input value={mesId} placeholder="请输入导入的ID" onChange={(e) => setMesId(e.target.value)} />
      </Modal>
      <MiniMap />

      {/* <Modal title="请记住这个ID！" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}> */}
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




