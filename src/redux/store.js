import { configureStore } from '@reduxjs/toolkit';
import productReducer from './ProductSlice';
import paymentReducer from './FormCardSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    paymentForm: paymentReducer,
    },
});
