import { configureStore } from "@reduxjs/toolkit";
import counter from "./reducer";
export const store = configureStore({
  // 数据处理
  reducer: {
    counter
  }
});


