package com.mjh.tooluse.mapper;

import com.mjh.tooluse.entity.InOrOut;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface InOrOutMapper {
    @Select("select * from tool.TOOL where id = #{mesId}")
    InOrOut importNodesAndEdges(String mesId);

    @Insert("insert into tool.TOOL(id, res) VALUES (#{id}, #{res})")
    int exportNodesAndEdges(InOrOut inOrOut);
}
