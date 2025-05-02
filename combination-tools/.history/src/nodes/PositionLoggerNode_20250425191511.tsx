import { Handle, Position, useReactFlow, type NodeProps } from '@xyflow/react';
import { type PositionLoggerNode } from './types';
import deleteIcon from '../../public/delete.png';
import bigIcon from '../../public/big.jpg';
import Fold from "../../public/fold.png"
import Unfold from "../../public/unfold.png"
import { Avatar, Flex, Select, message, Input, Drawer, TreeSelect } from 'antd';
import type { DrawerProps, TreeSelectProps } from 'antd';
import './index.css'
import { getType, getBeforeNode, getTreeList } from './utils.ts'
import addInput from "../../public/addInput.png"
import deleteInput from "../../public/deleteInput.png"
import eventBus from './eventBus.ts';
import { useEffect, useState } from 'react';
// import eventBusEdge from '../edges/eventBusEdges.ts';

export function PositionLoggerNode({
  id,
  data,
  isConnectable
}: NodeProps<PositionLoggerNode>) {
  const [open, setOpen] = useState(false);
  const [placement,] = useState<DrawerProps['placement']>('right');
  const [inputCount, setInputCount] = useState(data.inputs ? data.inputs?.length : 0); // 用于记录输入框的数量
  const [outputCount, setOutputCount] = useState(data.outputs ? data.outputs?.length : 0); // 用于记录输入框的数量
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow();
  const [treeData, setTreeData] = useState<TreeSelectProps['treeData']>([]); // 树选择器的可选项
  const [treeValues, setTreeValues] = useState<Map<string, string>>(new Map()); // 当前所选的选项
  const [prefixes, setPrefixes] = useState<Map<string, string>>(new Map()); // 前缀
  const [messageApi, contextHolder] = message.useMessage();

  const handleClick = () => {
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  };

  const handleAdd = (id: string, addType: string) => {
    const getInputKey = () => `key-${+new Date()}`;
    let input = {}
    if (addType == '输入') {
      const addInput = () => {
        const newInputIndex = inputCount ? inputCount + 1 : Number(inputCount) + 1;
        setInputCount(newInputIndex);
        return `input${newInputIndex}`;
      };
      input = {
        key: getInputKey(),
        name: addInput(),
        isFold: false,
        type: 'string',
        text: "这里是描述",
        value: {
          name: '',
          type: '',
          input: '',
          urlValueName: '',
        }
      }
    } else {
      const addInput = () => {
        const newInputIndex = outputCount ? outputCount + 1 : Number(outputCount) + 1;
        setOutputCount(newInputIndex);
        return `output${newInputIndex}`;
      };
      input = {
        key: getInputKey(),
        name: addInput(),
        text: "这里是描述",
        isFold: true,
        type: 'string'
      }
    }
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        if (addType == '输入') {
          node.data?.inputs?.push(input);
        }
        else if (addType == '输出') {
          node.data?.outputs?.push(input);
        }
      }
      return node;
    });
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }

  const handleDelete = (key: string, deleteType: string) => {
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        if (deleteType == '输入') {
          node.data.inputs = node.data?.inputs?.filter((item: any) => item.key !== key);
        } else if (deleteType == '输出') {
          node.data.outputs = node.data?.outputs?.filter((item: any) => item.key !== key);
        }
      }
      return node;
    });
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }

  const updateParam = (key: string, value: string) => {
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        node.data?.inputs?.map((item: any) => {
          if (item.key == key) {
            item.value.urlValueName = value;
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

  const updateInput = (key: string, value: string, updateType: string) => {
    if (value.length > 6) {
      messageApi.open({
        type: 'warning',
        content: '变量名最长为6个字符',
      });
      return;
    }
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        if (updateType == '输入') {
          node.data?.inputs?.map((item: any) => {
            if (item.key == key) {
              item.name = value
            }
          })
        } else if (updateType == '输出') {
          node.data?.outputs?.map((item: any) => {
            if (item.key == key) {
              item.name = value
            }
          })
        }
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  };

  const updateIsFold = (key: string, updateType: string) => {
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        if (updateType == '输入') {
          node.data?.inputs?.map((item: any) => {
            if (item.key == key) {
              item.isFold = !item.isFold
            }
          })
        } else if (updateType == '输出') {
          node.data?.outputs?.map((item: any) => {
            if (item.key == key) {
              item.isFold = !item.isFold
            }
          })
        }
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }
  const updateItem = (key: string, updateType: string, value?: string) => {
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        if (updateType == '输入') {
          node.data?.inputs?.map((item: any) => {
            if (item.key == key) {
              if (value) {
                item.text = value
              }
            }
          })
        } else if (updateType == '输出') {
          node.data?.outputs?.map((item: any) => {
            if (item.key == key) {
              if (value) {
                item.text = value
              }
            }
          })
        }
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }

  const updateUrl = (value: string) => {
    const updateNodes = getNodes();
    updateNodes.forEach((node: any) => {
      if (node.id === id) {
        node.data.urlLine = value
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }

  const getTree =  ( edges = getEdges(),nodes = getNodes()) => {
    // const edges = getEdges();
    // const nodes = getNodes();
    // console.log(edges?.length, nodes?.length);
    const result = getBeforeNode(edges, id); // 获取当前节点的前置节点
    // console.log('result', result);
    console.log(edges);
    
    const tree = getTreeList(result, nodes); // 获取选择列表的树形结构
    // console.log('tree', tree);
    setTreeData(tree)
  }

  useEffect(() => {
    getTree()
    data.inputs?.map((item: any) => {
      setTreeValues(prevState => {
        return new Map(prevState).set(`${item.key}_${item?.value?.name}`, String(`${item?.value.name}·${item?.value.input}·${item?.value.type}`))
      });
      setPrefixes(prevState => new Map(prevState).set(item.key, item?.value.name));
    })
    eventBus.on('dataUpdated', (result: any) => {
      getTree(result.nodes,result.edges);
  });
  }, [])

  const onChangeSelect = (key: string, value: string, type: string) => {
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        if (type == "输入") {
          node.data?.inputs?.map((item: any) => {
            if (item.key == key) {
              item.type = value
            }
          })
        } else if (type == "输出") {
          node.data?.outputs?.map((item: any) => {
            if (item.key == key) {
              item.type = value
            }
          })
        }
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  };

  const onChangeTreeSelect = (selectedValue: string, treeKey: string) => {
    setTreeValues(prevState => new Map(prevState).set(treeKey, selectedValue));

    const parentValue = treeData?.find((item: any) =>
      item.children.some((child: any) => child.value === selectedValue)
    )?.value;

    setPrefixes(prevState => new Map(prevState).set(treeKey, String(parentValue)));
    let [input, type] = selectedValue.split("·");
    // 更新InitialNodes
    const InitialNodes = getNodes();
    const updateNodes = InitialNodes.map((node: any) => {
      if (node.id === id) {
        node.data.inputs?.map((item: any) => {
          if (item.key == treeKey) {
            item.value = {
              name: String(parentValue),
              input: input,
              type: type
            }
          }
        })
      }
      return node;
    });
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  };

  const onChangeSelectMethod = (value: string) => {
    const updateNodes = getNodes();
    updateNodes.forEach((node: any) => {
      if (node.id === id) {
        node.data.method = value
      }
      return node;
    })
    setNodes(updateNodes);
    eventBus.emit('dataUpdated',{
      nodes: updateNodes,
      edges: getEdges()
    });
  }

  return (
    <>
      {contextHolder}
      <div className="react-flow__node-default" style={{ width: '220px' }} onClick={handleClick}>
        <Flex justify="space-between">
          <Flex gap="small">
            <Avatar className="avatar" src={bigIcon}></Avatar>
            {data.label && <div>{data.label}</div>}
          </Flex>
          <Avatar className="avatar" src={deleteIcon} onClick={
            () => {
              const updateNodes = getNodes().filter(node => node.id !== id);
              const updateEdges = getEdges().filter((edge: any) => edge.source !== id && edge.target !== id);
              setNodes(nodes => updateNodes);
              setEdges((edges: any) =>rget !== id));
              eventBus.emit('dataUpdated',{
                nodes: updateNodes,
                edges: getEdges()
              });
            }
          } />
        </Flex>

        <div>
          <div>
            <Flex gap='small' style={{ marginTop: '10px' }} wrap >输入
              {data.inputs?.map((item, index) => {
                return <div className='input' key={index}>
                  <span style={{ color: 'gray' }}>{item?.type && getType(item?.type)} </span>
                  {item?.name}</div>
              })}
            </Flex>

            <Flex gap='small' style={{ marginTop: '10px' }} wrap >输出
              {data.outputs?.map((item, index) => {
                return <div className='input' key={index}>
                  <span style={{ color: 'gray' }}>{item?.type && getType(item?.type)} </span>
                  {item?.name}</div>
              })}
            </Flex>

            <Flex gap="small" style={{ marginTop: '10px' }} align='center'>
              URL
              {/* <Avatar style={{ width: '16px', height: '16px' }} src={bigIcon} /> */}
              <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{data.urlLine}</div>
            </Flex>

            <Flex gap="small" style={{ marginTop: '10px' }} align='center'>
              Method
              {/* <Avatar style={{ width: '16px', height: '16px' }} src={bigIcon} /> */}
              <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>{data.method}</div>
            </Flex>
          </div>
        </div>
        {/* Handle：锚点
          type： 锚点类型
            source：出发
            target：接收 
          position：锚点位置
          id：锚点id
          style：锚点样式
      */}
        <Handle type="target" position={Position.Left} id='b' isConnectable={isConnectable} />
        <Handle type="source" position={Position.Right} id='b' isConnectable={isConnectable} />
      </div>

      <Drawer
        title={data.label}
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
        size="default"
      >
        <Flex wrap gap="small" align='center'>
          <div>URL</div>
          <Input id="url" value={data.urlLine} style={{ width: '330px', marginLeft: '23px' }} onChange={
            (e) => {
              updateUrl(e.target.value)
            }
          } />
        </Flex>
        <Flex wrap gap="small" className='margin-top' align='center'>
          <div>Method</div>
          <Select
            style={{ width: '120px', height: '26px' }}
            placeholder="Select Type"
            optionFilterProp="label"
            onChange={(value) => onChangeSelectMethod(value)}
            defaultValue={data.method}
            options={[
              {
                value: 'GET',
                label: 'GET',
              },
              {
                value: 'POST',
                label: 'POST',
              }
            ]}
          />
        </Flex>

        <Flex style={{ fontSize: "18px", width: '95%', marginTop: '20px' }} justify="space-between" align='center'>
          <span>输入</span>
          <Avatar className='avatar' onClick={() => handleAdd(id, "输入")} src={addInput}></Avatar>
        </Flex>
        <Flex gap="small" style={{ color: 'gray' }} className='margin-top'>
          <div style={{ width: '80px' }} className='width-name'>变量名</div>
          <div style={{ width: '80px' }}>变量值</div>
        </Flex>
        {data.inputs?.map((item) => {
          return <Flex style={{ width: "98%", backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '4px' }} wrap key={item.key} gap="small" className='margin-top' align='center'>

            <Input style={{ width: '80px' }} className='width-name' value={item.name}
              onChange={
                (e) => {
                  updateInput(item.key, e.target.value, "输入")
                }
              }
            />

            <Select
              style={{ width: '70px' }}
              placeholder="Select Type"
              optionFilterProp="label"
              onChange={(value) => onChangeSelect(item.key, value, "输入")}
              defaultValue={item.type}
              options={[
                {
                  value: 'string',
                  label: 'str',
                },
                {
                  value: 'number',
                  label: 'num',
                },
                {
                  value: 'boolean',
                  label: 'bol',
                },
              ]}
            />
            <TreeSelect
              style={{ width: '150px' }}
              value={treeValues.get(`${item.key}_${item?.value?.name}`)}
              // prefix={prefixes.get(item.key)}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              placement="bottomRight"
              allowClear
              treeDefaultExpandAll
              onChange={(value) => onChangeTreeSelect(value, `${item.key}_${item?.value?.name}`)}
              treeData={treeData}
            />

            {item.isFold ?
              <Avatar style={{ position: 'relative', left: '0px' }} onClick={() => updateIsFold(item.key, "输入")} className='avatar' src={Fold}></Avatar> :
              <Avatar style={{ position: 'relative', left: '0px', padding: '2px' }} onClick={() => updateIsFold(item.key, "输入")} className='avatar' src={Unfold}></Avatar>
            }
            <Avatar style={{ position: 'relative', left: '0px' }} onClick={() => handleDelete(item.key, "输入")} className='avatar' src={deleteInput}></Avatar>

            {
              !item.isFold && <Flex vertical>
                <div style={{ width: '80px', color: 'gray' }} className='width-name'>参数名</div>
                <Input className='width-name' style={{ width: "360px" }} value={item?.value && item.value.urlValueName}
                  onChange={
                    (e) => {
                      updateParam(item.key, e.target.value)
                    }
                  }
                />
              </Flex>
            }
          </Flex>
        })}


        <Flex style={{ fontSize: "18px", width: '95%', marginTop: '20px' }} justify="space-between" align='center'>
          <span>输出</span>
          <Avatar className='avatar' onClick={() => handleAdd(id, "输出")} src={addInput}></Avatar>
        </Flex>
        <Flex gap="small" style={{ color: 'gray' }} className='margin-top'>
          <div style={{ width: '80px' }} className='width-name'>变量名</div>
          <div style={{ width: '80px' }}>变量类型</div>
        </Flex>
        {data.outputs.map((item) => {
          return <Flex style={{ width: "98%", backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '4px' }} wrap key={item.key} gap="small" className='margin-top' align='center'>
            <Input style={{ width: '80px' }} value={item.name} onChange={
              (e) => {
                updateInput(item.key, e.target.value, "输出")
              }
            } />
            <Select
              className='width-type'
              placeholder="Select Type"
              optionFilterProp="label"
              onChange={(value) => onChangeSelect(item.key, value, "输出")}
              defaultValue={item.type}
              options={[
                {
                  value: 'string',
                  label: 'string',
                },
                {
                  value: 'number',
                  label: 'number',
                },
                {
                  value: 'boolean',
                  label: 'boolean',
                },
              ]}
            />

            {item.isFold ?
              <Avatar style={{ position: 'relative', left: '135px' }} onClick={() => updateIsFold(item.key, "输出")} className='avatar' src={Fold}></Avatar> :
              <Avatar style={{ position: 'relative', left: '135px', padding: '2px' }} onClick={() => updateIsFold(item.key, "输出")} className='avatar' src={Unfold}></Avatar>
            }
            <Avatar style={{ position: 'relative', left: '138px' }} onClick={() => handleDelete(item.key, "输出")} className='avatar' src={deleteInput}></Avatar>

            {!item.isFold && <Flex vertical>
              <div style={{ width: '80px', color: 'gray' }} >结果</div>
              <Input className='width-name' disabled style={{ width: "360px" }} value={item.text} onChange={
                (e) => {
                  updateItem(item.key, "输出", e.target.value)
                }
              } />
            </Flex>}

          </Flex>
        })}
      </Drawer>
    </>
  );
}