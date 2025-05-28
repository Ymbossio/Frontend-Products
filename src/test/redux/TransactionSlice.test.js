// src/test/redux/transactionSlice.test.js

import reducer, { setTransactionData, clearTransactionData } from '../../redux/TransactionSlice';

describe('transactionSlice', () => {
  const initialState = {
    transactionData: null,
  };

  it('should return the initial state by default', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle setTransactionData', () => {
    const mockData = {
      id: 'tx123',
      status: 'PENDING',
      amount: 100,
    };

    const newState = reducer(initialState, setTransactionData(mockData));
    expect(newState.transactionData).toEqual(mockData);
  });

  it('should handle clearTransactionData', () => {
    const stateWithData = {
      transactionData: { id: 'tx123', status: 'PENDING' },
    };

    const newState = reducer(stateWithData, clearTransactionData());
    expect(newState.transactionData).toBeNull();
  });
});
