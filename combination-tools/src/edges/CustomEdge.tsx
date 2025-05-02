import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import { type CustomEdge } from './types';
import { Avatar } from 'antd';
// import eventBusEdge from './eventBusEdges';
import addIcon from "../../public/addInput.png";
import deleteIcon from '../../public/deleteInput.png';
import { eventAddNode } from '../common.ts';
import eventBus  from '../nodes/eventBus';
// import axios from 'axios';
// import {baseURL} from '../common'
// import { useEffect } from 'react';
// const baseURL = 'http://127.0.0.1:4523/m1/6033648-0-default'

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, source, target }: EdgeProps<CustomEdge>) {
  const {  getNodes, getEdges,setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

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
          transform: `translate(-100%, -50%) translate(${labelX - 10}px,${labelY}px)`,
          width: 14,
          height: 14,
        }}
          className="avatar" src={deleteIcon} onClick={() => {
            const updateEdges = getEdges().filter((e:any) => e.id !== id);
            setEdges(updateEdges);
            eventBus.emit('dataUpdated',{
              nodes: getNodes(),
              edges: updateEdges
            });
          }} />
        <Avatar style={{
          position: 'absolute',
          transform: `translate(0%, -50%) translate(${labelX + 10}px,${labelY}px)`,
          pointerEvents: 'all',
          width: 14,
          height: 14,
        }}
          className="avatar" src={addIcon} onClick={() => {
            eventAddNode.emit('addNode',{
              randomId: `randomnode_${+new Date()}`,
              edgeId: id,
              source: source,
              target: target
            })
          }} />
      </EdgeLabelRenderer>
    </>
  );
}