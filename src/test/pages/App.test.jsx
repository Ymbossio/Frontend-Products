import { render, screen, fireEvent, within, act } from '@testing-library/react';
import App from '../../pages/App';
import { vi } from 'vitest';
import { setSelectedProduct } from '../../redux/ProductSlice';

// 👇 mockDispatch definido una sola vez y reutilizado en todos los tests
const mockDispatch = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      product: { selectedProduct: null },
    }),
}));

// 👇 Mock de la API
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

describe('App component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza productos tras fetch', async () => {
    render(<App />);
    expect(await screen.findByText('Producto 1')).toBeInTheDocument();
    expect(await screen.findByText('Producto 2')).toBeInTheDocument();
  });

  test('muestra "Loading..." mientras se espera fetchProducts', async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    vi.doMock('../../api/products', () => ({
      fetchProducts: () => fetchPromise,
    }));

    const { default: AppWithPendingFetch } = await import('../../pages/App');
    render(<AppWithPendingFetch />);

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    act(() => {
      resolveFetch([]);
    });
  });

  // ✅ Este test es el que te faltaba para cubrir la rama `products.length !== 0`
  test('no muestra "Loading..." cuando hay productos', async () => {
    render(<App />);
    expect(await screen.findByText('Producto 1')).toBeInTheDocument();
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  });
  

  test('al hacer click en boton "Pagar con tarjeta" abre modal y dispatch setSelectedProduct', async () => {
    render(<App />);

    const card = await screen.findByText('Producto 1');
    const cardContainer = card.closest('.card-body');
    const button = within(cardContainer).getByText(/Adquirir/i);

    expect(button).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setSelectedProduct(expect.objectContaining({ name: 'Producto 1' }))
    );
  });
});
