import reducer, {
  setSelectedProduct,
  clearSelectedProduct
} from '../../redux/ProductSlice';

describe('productSlice', () => {
  const initialState = {
    selectedProduct: null,
  };

  it('debería retornar el estado inicial por defecto', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('debería manejar setSelectedProduct', () => {
    const product = { id: 1, name: 'Producto de prueba' };
    const nextState = reducer(initialState, setSelectedProduct(product));

    expect(nextState.selectedProduct).toEqual(product);
  });

  it('debería manejar clearSelectedProduct', () => {
    const prevState = {
      selectedProduct: { id: 1, name: 'Producto de prueba' },
    };
    const nextState = reducer(prevState, clearSelectedProduct());

    expect(nextState.selectedProduct).toBeNull();
  });
});
