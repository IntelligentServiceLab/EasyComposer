package com.mjh.tooluse.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mjh.tooluse.entity.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@RestController
public class AiController {
    @PostMapping("/url")
    public List<Node> url(@RequestBody Ai ai) throws IOException, InterruptedException {
        System.out.println(ai);
        //获取所有节点
        List<Node> nodesBegin = ai.getNodes();

        //获取所有的边
        List<Edge> edgesLine = ai.getEdges();

        //获取边中的逻辑
        String[] edgeNames = new String[edgesLine.size()];
        for (int i = 0; i < edgesLine.size(); i++) {
            String edgesSource = edgesLine.get(i).getSource();
            String edgesTarget = edgesLine.get(i).getTarget();
            String edgeName = edgesSource + "->" + edgesTarget;
            edgeNames[i] = edgeName;
        }

        // 构建图
        Map<String, Set<String>> graph = new HashMap<>();
        Map<String, Integer> inDegree = new HashMap<>();

        for (String edgeName : edgeNames) {
            String[] nodeName = edgeName.split("->");
            String nodeA = nodeName[0];
            String nodeB = nodeName[1];

            graph.putIfAbsent(nodeA, new HashSet<>());
            graph.get(nodeA).add(nodeB);

            graph.putIfAbsent(nodeB, new HashSet<>());

            // 记录入度
            inDegree.put(nodeB, inDegree.getOrDefault(nodeB, 0) + 1);
            inDegree.putIfAbsent(nodeA, 0);
        }

        // 执行拓扑排序
        List<String> sortedOrder = topologicalSort(graph, inDegree);

        // 输出排序后的节点顺序
        System.out.println("排序后的节点顺序: " + sortedOrder);

        //定义一个排序后的节点顺序
        List<Node> nodes = new ArrayList<>();

        //根据节点顺序，将节点进行排序
        for (int e = 0; e < sortedOrder.size(); e++) {
            for (int n = 0; n < nodesBegin.size(); n++) {
                if (nodesBegin.get(n).getId().equals(sortedOrder.get(e))) {
                    nodes.add(nodesBegin.get(n));
                }
            }
        }

        String label1 = nodes.get(0).getData().getLabel();
        for (int k = 0; k < nodes.size(); k++) {
            if (nodes.get(k).getData().getUrlLine() != null){
                //定义一个数组接收该节点的输出中的 text
                List<ResultList> resultList = new ArrayList<>();
                List<String> outputList = new ArrayList<>();
                //获取 url
                String urlBegin = nodes.get(k).getData().getUrlLine();
                System.out.println("urlBegin:" + urlBegin);

                //获取 header 中 x-rapidapi-host
                String host = UriComponentsBuilder.fromHttpUrl(urlBegin).build().getHost();
                System.out.println("host:" + host);

                //获取方法类型：GET or POST
                String way = nodes.get(k).getData().getMethod();
                System.out.println("way:" + way);

                //找出该节点对应的参数名和参数值
                List<Node.Data.Input> inputsK = nodes.get(k).getData().getInputs();
                System.out.println("inputsK:" + inputsK);
                List<Body> bodys  = new ArrayList<>();
                int w = 0;
                for (int i = 0; i < inputsK.size(); i++) {
                    for (int j = 0; j <= k; j++) {
                        if (inputsK.get(i).getValue().getName().equals(nodes.get(j).getData().getLabel())){
                            List<Node.Data.Input> inputIn = nodes.get(j).getData().getInputs();
                            List<Node.Data.Output> outputIn = new ArrayList<>();
                            if (nodes.get(j).getData().getOutputs() != null){
                                outputIn = nodes.get(j).getData().getOutputs();
                            }
                            for (int in = 0; in < inputIn.size(); in++){
                                if (inputsK.get(i).getValue().getInput().equals(nodes.get(j).getData().getInputs().get(in).getName())){
                                    // 将数据存到 getBody 数组中
                                    Body body = new Body(
                                            inputsK.get(i).getValue().getUrlValueName(),
                                            nodes.get(j).getData().getInputs().get(in).getText()
                                    );
                                    bodys.add(body);
                                }
                            }
                            if (!outputIn.isEmpty()){
                                for (int out = 0; out < outputIn.size(); out++){
                                    if (inputsK.get(i).getValue().getInput().equals(nodes.get(j).getData().getOutputs().get(out).getName())){
                                        // 将数据存到 getBody 数组中
                                        Body body= new Body(
                                                inputsK.get(i).getValue().getUrlValueName(),
                                                nodes.get(j).getData().getOutputs().get(out).getText()
                                        );
                                        bodys.add(body);
                                    }
                                }
                            }
                        }
                    }
                }
                for (int i = 0; i < bodys.size(); i++){
                    System.out.println("bodys:" + bodys.get(i));
                }

                //组合 GET 的请求 URL
                //初始化一个 StringBuilder 用于拼接字符串
                StringBuilder urlInputs = new StringBuilder();

                //组合最终的GET-url
                int beginGet = 0;
                List<InputsRequest> inputsRequestsUrl = new ArrayList<>();
                if ("GET".equalsIgnoreCase(way)){

                    for (int i = beginGet; i < bodys.size(); i++) {
                        String getUrlValueName = bodys.get(beginGet).getUrlValueName();
                        if (bodys.get(i).getUrlValueName().equals(getUrlValueName) && i != beginGet){
                            beginGet = i;
                            String finalUrl = urlBegin + "?" + urlInputs;
                            InputsRequest inputsRequest = new InputsRequest(finalUrl);
                            inputsRequestsUrl.add(inputsRequest);
                            urlInputs.setLength(0);
                            // 结束当前循环，跳到新的 i = begin 继续
                            i = beginGet - 1;  // 在循环末尾 i 会自增，所以设置为 begin - 1 来实现新的开始
                        } else if (i == bodys.size() - 1){
                            urlInputs.append("&");
                            // 拼接当前的 requestInput
                            urlInputs.append(bodys.get(i).getUrlValueName());
                            urlInputs.append("=");
                            urlInputs.append(bodys.get(i).getUrlValue());
                            String finalUrl = urlBegin + "?" + urlInputs;
                            InputsRequest inputsRequest = new InputsRequest(finalUrl);
                            inputsRequestsUrl.add(inputsRequest);
                        } else {
                            if (i - beginGet > 0){
                                urlInputs.append("&");
                            }
                            // 拼接当前的 requestInput
                            urlInputs.append(bodys.get(i).getUrlValueName());
                            urlInputs.append("=");
                            urlInputs.append(bodys.get(i).getUrlValue());
                        }
                    }
                }
                for (InputsRequest inputsRequest : inputsRequestsUrl) {
                    System.out.println("inputsRequestsUrl:" + inputsRequest);
                }


                // GET 的请求
                for (InputsRequest inputsRequest : inputsRequestsUrl) {
                    HttpRequest request = null;
                    if ("GET".equalsIgnoreCase(way)) {
                        String endUrl = inputsRequest.getFinalUrl();
                        //请求
                        request = HttpRequest.newBuilder()
                                .uri(URI.create(endUrl))
                                .header("x-rapidapi-key", "49ae8595d7msh24cc0dcd7f05ed5p183d1fjsn43672a8cab9b")
                                .header("x-rapidapi-host", host)
                                .method("GET", HttpRequest.BodyPublishers.noBody())
                                .build();
                    }
                    HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
                    System.out.println(response.body());
                    String jsonResponse = response.body();

                    // 解析 JSON 数据
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode rootNode = objectMapper.readTree(jsonResponse);

                    // 遍历并存储所有有值的节点到 List
                    traverseJsonNode(rootNode, "", resultList);
                }

                //组合最终的 POST-body
                Map<String, String> map = new HashMap<>();
                List<String> inputsRequestsBody = new ArrayList<>();
                if ("POST".equals(way)){
                    for (int j = 0; j < bodys.size(); j++) {
                        if (j == bodys.size() - 1 || true) { // 如果想每次都添加，可以修改为 true
                            try {
                                // 创建 ObjectMapper 对象
                                ObjectMapper objectMapper = new ObjectMapper();
                                // 将 Map 转换为 JSON 格式
                                String json = objectMapper.writeValueAsString(map);
                                System.out.println(json);
                                inputsRequestsBody.add(json);
                                System.out.println(inputsRequestsBody);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                }

                for (String s : inputsRequestsBody) {
                    System.out.println("inputsRequestsBody:" + s + ";");
                }

                // POST 请求
                for (String s : inputsRequestsBody) {
                    HttpRequest request = null;
                    request = HttpRequest.newBuilder()
                            .uri(URI.create(urlBegin))
                            .header("x-rapidapi-key", "49ae8595d7msh24cc0dcd7f05ed5p183d1fjsn43672a8cab9b")
                            .header("x-rapidapi-host", host)
                            .header("Content-Type", "application/json")
                            .method("POST", HttpRequest.BodyPublishers.ofString(s))
                            .build();
                    HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
                    System.out.println(response.body());
                    String jsonResponse = response.body();

                    // 解析 JSON 数据
                    ObjectMapper objectMapper = new ObjectMapper();
                    JsonNode rootNode = objectMapper.readTree(jsonResponse);

                    // 遍历并存储所有有值的节点到 List
                    traverseJsonNode(rootNode, "", resultList);
                }

                //将输出放到该节点的 outputs 中
                if (!resultList.isEmpty()) {
                    for (int i = 0; i < nodes.get(k).getData().getOutputs().size(); i++) {
                        nodes.get(k).getData().getOutputs().get(i).setText(resultList.get(i).getValue());
                    }
                }

//                //插入nodes中
//                nodes.get(k).getData().setOutputs(outputs);
            }

            //输入到最后一个节点的out中
            List<Node.Data.Input> inputsEndNode = nodes.get(0).getData().getInputs();

            if (k == nodes.size() - 1){
                System.out.println(k);
                List<Node.Data.Output> endNodeOutputs =nodes.get(k).getData().getOutputs();
                for (Node.Data.Output endNodeOutput : endNodeOutputs) {
                    if (endNodeOutput.getValue().getName().equals(label1)) {
                        for (Node.Data.Input input : inputsEndNode) {
                            if (endNodeOutput.getValue().getInput().equals(input.getName())) {
                                endNodeOutput.getValue().setText(input.getText());
                            }
                        }
                    }
                    for (int h = 1; h < nodes.size(); h++) {
                        if (endNodeOutput.getValue().getName().equals(nodes.get(h).getData().getLabel())) {
                            for (int o = 0; o < nodes.get(h).getData().getOutputs().size(); o++) {
                                if (endNodeOutput.getValue().getInput().equals(nodes.get(h).getData().getOutputs().get(o).getName())) {
                                    endNodeOutput.getValue().setText(nodes.get(h).getData().getOutputs().get(o).getText());
                                    System.out.println("1");
                                }
                            }
                        }
                    }
                }
            }
        }
        System.out.println(nodes);
        return nodes;
    }

    // 拓扑排序
    public static List<String> topologicalSort(Map<String, Set<String>> graph, Map<String, Integer> inDegree) {
        List<String> sortedOrder = new ArrayList<>();
        Queue<String> queue = new LinkedList<>();

        // 初始化队列，将所有入度为0的节点加入队列
        for (String node : inDegree.keySet()) {
            if (inDegree.get(node) == 0) {
                queue.offer(node);
            }
        }

        // 进行拓扑排序
        while (!queue.isEmpty()) {
            String current = queue.poll();
            sortedOrder.add(current);

            // 遍历所有与当前节点相连的邻接节点
            if (graph.containsKey(current)) {
                for (String neighbor : graph.get(current)) {
                    // 减少邻接节点的入度
                    inDegree.put(neighbor, inDegree.get(neighbor) - 1);
                    // 如果入度为0，加入队列
                    if (inDegree.get(neighbor) == 0) {
                        queue.offer(neighbor);
                    }
                }
            }
        }

        // 返回拓扑排序的结果
        return sortedOrder;
    }

    private static void traverseJsonNode(JsonNode node, String path, List<ResultList> resultList) {
        if (node.isObject()) {
            node.fieldNames().forEachRemaining(fieldName -> {
                String newPath = path.isEmpty() ? fieldName : path + "." + fieldName;
                traverseJsonNode(node.get(fieldName), newPath, resultList);
            });
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                String newPath = path + "[" + i + "]";
                traverseJsonNode(node.get(i), newPath, resultList);
            }
        } else if (!node.isNull()) {
            resultList.add(new ResultList(path, node.asText()));
        }
    }
}