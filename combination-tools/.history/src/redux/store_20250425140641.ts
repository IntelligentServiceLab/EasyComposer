import { configureStore } from "@reduxjs/toolkit";
import counter from "./reducer";
// 导出
export const store = configureStore({
  // 数据处理
  reducer: {
    counter
  }
});


