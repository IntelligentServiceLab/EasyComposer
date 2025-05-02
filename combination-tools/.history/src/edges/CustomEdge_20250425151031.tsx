import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { type CustomEdge } from './types';
import { Avatar } from 'antd';
import eventBusEdge from './eventBusEdges';
import addIcon from "../../public/addInput.png";
import deleteIcon from '../../public/deleteInput.png';
import { eventAddNode } from '../common.ts';
// import axios from 'axios';
// import {baseURL} from '../common'
// import { useEffect } from 'react';
// const baseURL = 'http://127.0.0.1:4523/m1/6033648-0-default'

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, source, target }: EdgeProps<CustomEdge>) {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const handleClick = () => {
    // const res = await axios.post(`${baseURL}/deleteLine/${id}`)
    // if(res.status == 200) {
    // console.log("删除了");

    //   setEdges((es) => es.filter((e) => e.id !== id));
    // }
    // console.log(source,target);

    setEdges((es) => es.filter((e) => e.id !== id));

    eventBusEdge.emit('edgeUpdate');
    // setCount(count+1);
    // 1. 删除边
    // setEdges((es) => es.filter((e) => e.id !== id));
    // // 2. 新建节点
    // const newNode = {
    //   id: `node_${count}`,
    //   data: { label: `node_${count}` },
    //   width: dimensions.width,
    //   height: dimensions.height,
    //   position: { x: (targetX + sourceX) / 2 - dimensions.width / 2 , y: (targetY + sourceY) / 2 - dimensions.height / 2 },
    // };
    // setNodes((nds) => nds.concat(newNode));
    // // 3. 修改节点位置
    // setNodes((nds) => nds.map((node) => (node.id === id[0] ? { ...node, position: { x: 200, y: 100 } } : node)));
    // setNodes((nds) => nds.map((node) => (node.id === id[3] ? { ...node, position: { x: -100, y: 300 }} : node)));
    // // 4. 新建边
    // setEdges((es) => es.concat({ id: `a${count}`, type: 'custom-edge',source: id[0] , target: `node_${count}`}));
    // setEdges((es) => es.concat({ id: `b${count}`, type: 'custom-edge',source: `node_${count}`, target: id[3]}));
  }
  // useEffect(() => {
  //   console.log(getEdges());
  // },[handleClick])
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <Avatar style={{
          position: 'absolute',
          pointerEvents: 'all',
          transform: `translate(-100%, -50%) translate(${labelX - 4}px,${labelY}px)`,
          width: 12,
          height: 12,
        }}
          className="avatar" src={deleteIcon} onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
            eventBusEdge.emit('edgeUpdate');
          }} />
        <Avatar style={{
          position: 'absolute',
          transform: `translate(0%, -50%) translate(${labelX + 4}px,${labelY}px)`,
          pointerEvents: 'all',
          width: 12,
          height: 12,
        }}
          className="avatar" src={addIcon} onClick={() => {
            eventAddNode.emit('addNode',{
              randomId: `randomnode_${+new Date()}`,
              sourceX: sourceX,
              sourceY: sourceY,
            })
          }} />
      </EdgeLabelRenderer>
    </>
  );
}