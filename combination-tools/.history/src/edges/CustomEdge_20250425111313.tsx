import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { type CustomEdge } from './types';
import eventBusEdge from './eventBusEdges';
// import axios from 'axios';
// import {baseURL} from '../common'
// import { useEffect } from 'react';
// const baseURL = 'http://127.0.0.1:4523/m1/6033648-0-default'

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY,source, target }: EdgeProps<CustomEdge>) {
  const { setEdges  } = useReactFlow();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const handleClick = () => {
    // const res = await axios.post(`${baseURL}/deleteLine/${id}`)
    // if(res.status == 200) {
    //   console.log("删除了");
      
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
        <button
          style={{
            position: 'absolute',
            transform: `translate(-98%, -98%) translate(${labelX-4}px,${labelY-4}px)`,
            pointerEvents: 'all',
            background: '',
            color: 'red',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          -
        </button>
        <button
          style={{
            position: 'absolute',
            transform: ` translate(-2%, -2%) translate(${labelX+4}px,${labelY+4}px)`,
            pointerEvents: 'all',
            background: '',
            color: 'green',
            border: 'none',
            cursor: 'pointer',
          }}
          // onClick={handleClick}
        >
          +
        </button>
      </EdgeLabelRenderer>
    </>
  );
}