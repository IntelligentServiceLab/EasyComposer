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


