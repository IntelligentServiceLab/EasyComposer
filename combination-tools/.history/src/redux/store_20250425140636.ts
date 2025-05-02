import { configureStore } from '@reduxjs/toolkit';
import nodeCountReducer from './reducer.ts';

// 定义仓库
// 引入configureStore 定义仓库
import { configureStore } from "@reduxjs/toolkit";
// 导入counterSlice
import counter from "./reducer";
// 导出
export const store = configureStore({
  // 数据处理
  reducer: {
    counter
  }
});


