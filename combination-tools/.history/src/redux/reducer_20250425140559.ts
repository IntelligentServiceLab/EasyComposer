import { createSlice } from "@reduxjs/toolkit";
// 定义初始化状态
const initialState = { value: 0 };
// 创建切片
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    addValue: (state, action) => {
      state.value += action.payload;
    }
  }
});

// 导出动作
export const { increment, decrement, addValue } = counterSlice.actions;
// 导出处理器
export default counterSlice.reducer;
// 导出异步操作动作
export const syncAddvalue = value => dispatch => {
  setTimeout(() => {
    dispatch(addValue(value));
  }, 2000);
};

