import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from '../../pages/App';
import { vi } from 'vitest';
import { setSelectedProduct, clearSelectedProduct } from '../../redux/ProductSlice';

vi.mock('../../api/products', () => ({
  fetchProducts: () => Promise.resolve([
    {
      id: 1,
      name: 'Producto 1',
      description: 'Descripción 1',
      price: 1000,
      stock: 5,
      image: 'https://example.com/product1.jpg'
    },
    {
      id: 2,
      name: 'Producto 2',
      description: 'Descripción 2',
      price: 2000,
      stock: 10,
      image: 'https://example.com/product2.jpg'
    }
  ])
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      product: { selectedProduct: null },
    }),
}));

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza productos tras fetch', async () => {
    render(<App />);
    expect(await screen.findByText('Producto 1')).toBeInTheDocument();
    expect(await screen.findByText('Producto 2')).toBeInTheDocument();
  });

  test('al hacer click en boton "Pagar con tarjeta" abre modal y dispatch setSelectedProduct', async () => {
    render(<App />);

    const card = await screen.findByText('Producto 1');
    const cardContainer = card.closest('.card-body');
    const button = within(cardContainer).getByRole('button', { name: /Pagar con tarjeta/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setSelectedProduct(expect.objectContaining({ name: 'Producto 1' }))
    );
  });
});
