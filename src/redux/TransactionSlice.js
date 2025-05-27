import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionData: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionData(state, action) {
      state.transactionData = action.payload;
    },
    clearTransactionData(state) {
      state.transactionData = null;
    }
  }
});

export const { setTransactionData, clearTransactionData } = transactionSlice.actions;
export default transactionSlice.reducer;
