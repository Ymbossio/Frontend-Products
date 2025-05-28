import { store } from '../../redux/store';
import { setSelectedProduct, clearSelectedProduct } from '../../redux/ProductSlice';
import { setFormData, resetForm } from '../../redux/FormCardSlice';

describe('Redux store', () => {
  it('debería inicializar con el estado correcto', () => {
    const state = store.getState();
    expect(state).toHaveProperty('product');
    expect(state).toHaveProperty('paymentForm');
  });

  it('debería manejar acciones de productSlice', () => {
    store.dispatch(setSelectedProduct({ id: 1, name: 'Producto' }));
    expect(store.getState().product.selectedProduct).toEqual({ id: 1, name: 'Producto' });

    store.dispatch(clearSelectedProduct());
    expect(store.getState().product.selectedProduct).toBeNull();
  });

  it('debería manejar acciones de paymentFormSlice', () => {
    store.dispatch(setFormData({ nombre: 'Juan', correo: 'juan@example.com' }));
    expect(store.getState().paymentForm.nombre).toBe('Juan');
    expect(store.getState().paymentForm.correo).toBe('juan@example.com');

    store.dispatch(resetForm());
    expect(store.getState().paymentForm).toEqual({
      nombre: '',
      correo: '',
      numero: '',
      expiracion: '',
      cvv: '',
      ciudad: '',
      direccion: '',
      aceptaTerminos: false,
      autorizaDatos: false,
    });
  });
});
