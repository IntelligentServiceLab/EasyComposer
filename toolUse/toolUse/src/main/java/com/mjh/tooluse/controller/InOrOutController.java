package com.mjh.tooluse.controller;

import com.mjh.tooluse.entity.InOrOut;
import com.mjh.tooluse.mapper.InOrOutMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class InOrOutController {

    @Autowired
    private InOrOutMapper inOrOutMapper;

    @PostMapping("/export")
    public String outNodesAndEdges(@RequestBody InOrOut inOrOut) {
        System.out.println(inOrOut);
        int i = inOrOutMapper.exportNodesAndEdges(inOrOut);
        if (i == 1){
            return "导出成功";
        } else {
            return "导出失败";
        }
    }

    @GetMapping("/import")
    public String importNodesAndEdges(@RequestParam String mesId) {
        InOrOut inOrOut = inOrOutMapper.importNodesAndEdges(mesId);
        System.out.println(inOrOut);
        return inOrOut.getRes();
    }
}
