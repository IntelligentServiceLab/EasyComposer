export const getType = (type: string | { type: string }) => {
    let innerType = '';
    if (typeof type == 'object') {
        innerType = type?.type;
    } else if (typeof type == 'string') {
        innerType = type;
    }
    switch (innerType) {
        case 'string':
            return 'str.';
        case 'boolean':
            return 'bol.';
        case 'number':
            return 'No.';
    }
}

export const getBeforeNode = (edges: any, id: string) => {
    // 构建邻接图（节点 -> 连接的目标节点）
    const graph: { [key: string]: string[] } = {};
    // console.log(id, 'edges', edges);
    
    edges.forEach((edge: any) => {
        if (!graph[edge.target]) {
            graph[edge.target] = [];
        }
        graph[edge.target].push(edge.source);
    });
    // console.log(id,'graph', graph); // 输出邻接图

    // 从目标节点（x）开始反向遍历，直到没有前置节点为止
    function findPredecessors(target: any) {
        const predecessors: any[] = [];
        const stack = [target];

        while (stack.length > 0) {
            const node = stack.pop();
            if (graph[node]) {
                graph[node].forEach(predecessor => {
                    if (!predecessors.includes(predecessor)) {
                        predecessors.push(predecessor);
                        stack.push(predecessor);
                    }
                });
            }
        }
        // console.log(id,predecessors); // 输出目标节点（x）的前置节点
        
        return predecessors;
    }

    // 获取到target为目标节点（x）的前置节点
    return findPredecessors(id);
}

export const getTreeList = (result: any, nodes: any) => {
    // 拿到开始节点的输入或者API节点的输出 中的lable，name，type
    const Data = result.flatMap((id: string) => {
        const node = nodes.find((n: any) => n.id === id);
        if (!node) return [];
        if (id === "a") {
            return node.data.inputs.map((input: any) => ({
                label: node.data.label,
                name: input.name,
                type: input.type
            }));
        } else {
            return node.data.outputs.map((output: any) => ({
                label: node.data.label,
                name: output.name,
                type: output.type
            }));
        }
    });
    console.log('Data',Data);

    // 将数据转换为树形结构
    const convertToTreeData = (data: any) => {
        // 创建一个空对象，记录每个 label 下的所有项
        const groupedData: { [key: string]: any } = {};

        // 遍历数据，将每个项按 label 分组
        data.forEach((item: any) => {
            const { label, name, type } = item;
            if (!groupedData[label]) {
                groupedData[label] = [];
            }
            groupedData[label].push({
                value: `${name}·${type}`,
                title: `${name}·${type}`
            });
        });

        // 构建树形结构
        const treeData = Object.keys(groupedData).map(label => ({
            value: label,
            title: label,
            disabled: true,
            children: groupedData[label]
        }));
        console.log('treeData',treeData);
        return treeData;
    }
    return convertToTreeData(Data)
};

