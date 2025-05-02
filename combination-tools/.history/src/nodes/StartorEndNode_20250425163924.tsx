import { useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { type StartorEndNode } from './types';
import { Avatar, Flex, Drawer, Input, message, Select, TreeSelect } from 'antd';
import type { DrawerProps, TreeSelectProps } from 'antd';
import "./index.css"
import addInput from "../../public/addInput.png"
import deleteInput from "../../public/deleteInput.png"
import Fold from "../../public/fold.png"
import Unfold from "../../public/unfold.png"
import { getType, getBeforeNode, getTreeList } from './utils';
import {
    useReactFlow
} from '@xyflow/react';
import eventBus from './eventBus.ts';
import eventBusEdge from '../edges/eventBusEdges.ts';

const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

export function StartorEndNode({
    id,
    data,
    isConnectable
}: NodeProps<StartorEndNode>) {
    const [messageApi, contextHolder] = message.useMessage();
    const [placement,] = useState<DrawerProps['placement']>('right');
    const { getNodes, setNodes, getEdges } = useReactFlow();
    const [open, setOpen] = useState(false);
    const [inputCount, setInputCount] = useState(data.inputs ? data.inputs?.length : data.outputs?.length); // 用于记录输入框的数量
    const [treeData, setTreeData] = useState<TreeSelectProps['treeData']>([]); // 树选择器的可选项
    const [treeValues, setTreeValues] = useState<Map<string, string>>(new Map()); // 当前所选的选项
    const [prefixes, setPrefixes] = useState<Map<string, string>>(new Map()); // 前缀

    const onClose = () => {
        setOpen(false);
    };

    const handleClick = () => {
        setOpen(true);
    }

    const handleAdd = (id: string, addType: string) => {
        const getInputKey = () => `key-${+new Date()}`;
        const addInput = () => {
            const newInputIndex = inputCount ? inputCount + 1 : Number(inputCount) + 1;
            setInputCount(newInputIndex);
            return `${id == 'a' ? 'input' : 'output'}${newInputIndex}`;
        };
        const input = {
            key: getInputKey(),
            name: addInput(),
            text: "这里是内容",
            type: 'string',
            isFold: true
        }
        const InitialNodes = getNodes();
        const updateNodes = InitialNodes.map((node: any) => {
            if (node.id === id) {
                if (addType == '输入') {
                    node.data?.inputs?.push(input);
                }
                else if (addType == '输出') {
                    node.data?.outputs?.push({
                        key: getInputKey(),
                        name: addInput(),
                        type: 'string',
                        isFold: true,
                        value: {
                            name: "开始",
                            type: "string",
                            input: "input",
                            text: "这里是结果"
                        }
                    });
                }
            }
            return node;
        });
        setNodes(updateNodes);
        eventBus.emit('dataUpdated');
    }

    const updateInput = (key: string, value: string) => {
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
                if (id == 'a') {
                    node.data?.inputs?.map((item: any) => {
                        if (item.key == key) {
                            item.name = value
                        }
                    })
                } else if (id == 'c') {
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
        eventBus.emit('dataUpdated');
    };

    const updateIsFold = (key: string) => {
        const InitialNodes = getNodes();
        const updateNodes = InitialNodes.map((node: any) => {
            if (node.id === id) {
                if (id == 'a') {
                    node.data?.inputs?.map((item: any) => {
                        if (item.key == key) {
                            item.isFold = !item.isFold;
                        }
                    })
                } else if (id == 'c') {
                    node.data?.outputs?.map((item: any) => {
                        if (item.key == key) {
                            item.isFold = !item.isFold;
                        }
                    })
                }
            }
            return node;
        })
        setNodes(updateNodes);
        eventBus.emit('dataUpdated');
    }

    const updateItem = (key: string, value: string) => {
        const InitialNodes = getNodes();
        const updateNodes = InitialNodes.map((node: any) => {
            if (node.id === id) {
                if (id == 'a') {
                    node.data?.inputs?.map((item: any) => {
                        if (item.key == key) {
                            if (value !== undefined) {
                                item.text = value;
                            }
                        }
                    })
                } else if (id == 'c') {
                    node.data?.outputs?.map((item: any) => {
                        if (item.key == key) {
                            if (value !== undefined) {
                                item.text = value;
                            }
                        }
                    })
                }
            }
            return node;
        })
        setNodes(updateNodes);
        eventBus.emit('dataUpdated');
    }


    const onChangeSelect = (key: string, value: string) => {
        const InitialNodes = getNodes();
        const updateNodes = InitialNodes.map((node: any) => {
            if (node.id === id) {
                if (id == 'a') {
                    node.data?.inputs?.map((item: any) => {
                        if (item.key == key) {
                            item.type = value
                        }
                    })
                } else if (id == 'c') {
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
        eventBus.emit('dataUpdated');
    };

    // const onChangeCheck: CheckboxProps['onChange'] = (e) => {
    //     console.log(`checked = ${e.target.checked}`);
    // };

    const handleDelete = (key: string) => {
        const InitialNodes = getNodes();
        const updateNodes = InitialNodes.map((node: any) => {
            if (node.id === id) {
                if (id == 'a') {
                    node.data.inputs = node.data?.inputs?.filter((item: any) => item.key !== key);
                } else if (id == 'c') {
                    node.data.outputs = node.data?.outputs?.filter((item: any) => item.key !== key);
                }
            }
            return node;
        });
        setNodes(updateNodes);
        eventBus.emit('dataUpdated');
    }

    const getTree = () => {
        const edges = getEdges();
        // console.log('edges',edges);

        const nodes = getNodes();
        // 通过边来获取到前面有哪些节点id
        const result = getBeforeNode(edges, id);
        // 通过节点id来获取到节点信息，并过滤拿到选择列表
        const tree = getTreeList(result, nodes);
        setTreeData(tree)
    }

    useEffect(() => {
        getTree();
        data.outputs?.map((item: any) => {
            setTreeValues(prevState => {
                return new Map(prevState).set(item.key, String(`${item?.value.input}·${item?.value.type}`))
            });
            setPrefixes(prevState => new Map(prevState).set(item.key, item?.value.name));
        })
        eventBus.on('dataUpdated', getTree);
        eventBusEdge.on('edgeUpdate', getTree);
    }, [])

    const onChangeTreeSelect = (selectedValue: string, treeKey: string) => {
        if (!selectedValue) {
            return;
        };

        setTreeValues(prevState => {
            return new Map(prevState).set(treeKey, selectedValue)
        });

        const parentValue = treeData?.find((item: any) =>
            item.children.some((child: any) => child.value === selectedValue)
        )?.value;

        setPrefixes(prevState => new Map(prevState).set(treeKey, String(parentValue)));
        console.log('selectedValue', selectedValue);

        let [input, type] = selectedValue.split("·");
        // 更新InitialNodes
        const InitialNodes = getNodes();
        const updateNodes = InitialNodes.map((node: any) => {
            if (node.id === id) {
                node.data.outputs?.map((item: any) => {
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
        eventBus.emit('dataUpdated');
    };

    const onPopupScroll: TreeSelectProps['onPopupScroll'] = (e) => {
        console.log('onPopupScroll', e);
    };

    return (
        <>
            {contextHolder}
            <Flex gap="small" className='boxstyle' vertical justify='center' onClick={handleClick}>
                <Flex gap="small">
                    <Avatar style={{ width: '16px', height: '16px' }} src={<img src={url} alt="avatar" />} />
                    {data.label && <div>{data.label}</div>}
                </Flex>

                <Flex gap='small' wrap >{data?.name}
                    {data?.inputs?.map((item, index) => {
                        return <div className='input' key={index}>
                            <span style={{ color: 'gray' }}>{item?.type && getType(item?.type)} </span>
                            {item?.name}
                        </div>
                    })}

                    {data?.outputs?.map((item, index) => {
                        return <div className='input' key={index}>
                            <span style={{ color: 'gray' }}>{item?.type && getType(item?.type)} </span>
                            {item?.name}
                        </div>
                    })}
                </Flex>

                {id == 'a' && <Handle type="source" position={Position.Right} isConnectable={isConnectable} />}
                {id == 'c' && <Handle type="target" position={Position.Left} isConnectable={isConnectable} />}
            </Flex>
            <Drawer
                title={data?.label}
                placement={placement}
                closable={false}
                onClose={onClose}
                open={open}
                key={placement}
                size="default"
            >
                <Flex style={{ fontSize: "18px" }} justify="space-between" align='center'>
                    <span>{data.name}</span>
                    <Avatar className='avatar' onClick={() => handleAdd(id, data.name)} src={addInput}></Avatar>
                </Flex>

                <Flex gap="small" style={{ color: 'gray' }} className='margin-top'>
                    <div style={{ width: '80px' }} className='width-name'>变量名</div>
                    <div style={{ width: '80px' }}>{id == 'a' ? '变量类型' : '变量值'}</div>
                    {/* {id == 'a' ? <div className='width-required'>必填</div> : <></>} */}
                </Flex>

                {data.inputs?.map((item) => {
                    return <Flex style={{ backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '4px' }} gap="small" wrap key={item.key} className='margin-top' align='center'>
                        <Input style={{ width: '80px' }} className='width-name' value={item.name} onChange={
                            (e) => {
                                updateInput(item.key, e.target.value)
                            }
                        } />
                        <Select
                            className='width-type'
                            placeholder="Select Type"
                            optionFilterProp="label"
                            onChange={(value) => onChangeSelect(item.key, value)}
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
                        {/* {id == 'a' ? <Checkbox className='width-required' defaultChecked={item.isRequired} onChange={onChangeCheck}></Checkbox> : <></>} */}
                        <Avatar style={{ fontSize: '18px', position: 'relative', left: '150px' }} onClick={() =>
                            updateIsFold(item.key)
                        } className='avatar' src={item.isFold ? Fold : Unfold} />
                        <Avatar style={{ position: 'relative', left: '150px' }} onClick={() => handleDelete(item.key)} className='avatar' src={deleteInput}></Avatar>


                        {!item.isFold && <Flex vertical>
                            <div style={{ width: '80px', color: 'gray', marginBottom: '2px' }} >输入值</div>
                            <Input className='width-name' style={{ width: "360px" }} value={item.text} onChange={
                                (e) => {
                                    updateItem(item.key, e.target.value)
                                }
                            } />
                        </Flex>}
                    </Flex>
                })}

                {data.outputs?.map((item) => {
                    return <Flex style={{ backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '4px' }} wrap key={item.key} gap="small" className='margin-top' align='center'>
                        <Input style={{ width: '80px' }} value={item.name} onChange={
                            (e) => {
                                updateInput(item.key, e.target.value)
                            }
                        } />
                        <Select
                            style={{ width: '70px' }}
                            placeholder="Select Type"
                            optionFilterProp="label"
                            onChange={(value) => onChangeSelect(item.key, value)}
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
                            style={{ width: '160px' }}
                            value={treeValues.get(item.key)}
                            prefix={prefixes.get(item.key)}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="Please select"
                            placement="bottomRight"
                            allowClear
                            treeDefaultExpandAll
                            onChange={(value) => onChangeTreeSelect(value, item.key)}
                            treeData={treeData}
                            onPopupScroll={onPopupScroll}
                        />
                        {/* <Avatar style={{ fontSize: '18px' }} onClick={() => 
                            updateItem(item.key)
                        } className='avatar' src={item.isFold ? Fold : Unfold} /> */}
                        {/* {id == 'a' ? <Checkbox className='width-required' defaultChecked={item.isRequired} onChange={onChangeCheck}></Checkbox> : <></>} */}


                        {/* <Avatar style={{ fontSize: '18px', position: 'relative', left: '10px' }} onClick={() =>
                            updateIsFold(item.key)
                        } className='avatar' src={item.isFold ? Fold : Unfold} /> */}
                        {
                            item.isFold ? 
                                <Avatar style={{ fontSize: '18px', position: 'relative', left: '10px' }} onClick={() =>
                                    updateIsFold(item.key)
                                } className='avatar'  src></Avatar> : 
                                <Avatar style={{ position: 'relative', left: '10px' }} onClick={() => handleDelete(item.key)} className='avatar' src={deleteInput}></Avatar>
                        }
                        <Avatar style={{ position: 'relative', left: '10px' }} onClick={() => handleDelete(item.key)} className='avatar' src={deleteInput}></Avatar>

                        {!item.isFold && <Flex vertical>
                            <div style={{ width: '80px', color: 'gray', marginBottom: '2px' }} >结果</div>
                            <Input className='width-name' disabled style={{ width: "360px" }} value={item.value && item.value?.text} onChange={
                                (e) => {
                                    updateItem(item.key, e.target.value)
                                }
                            } />
                        </Flex>
                        }
                        {/* {!item.isFold && <Flex vertical>
                            <div style={{ width: '80px', color: 'gray' }} >输入值</div>
                            <Input className='width-name' style={{ width: "360px" }} value={item.text} onChange={
                                (e) => {
                                    updateItem(item.key, e.target.value)
                                }
                            } />
                        </Flex>} */}
                    </Flex>
                })}

            </Drawer>
        </>
    );
}