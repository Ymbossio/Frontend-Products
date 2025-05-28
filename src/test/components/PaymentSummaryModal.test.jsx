import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentSummaryModal } from '../../components/PaymentSummaryModal';
import { vi } from 'vitest';

const mockDispatch = vi.fn();
let mockSelectorReturn = {
  aceptaTerminos: false,
  autorizaDatos: false,
};

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({ paymentForm: mockSelectorReturn }),
}));

const mockHandlePayment = vi.fn();
const mockSetModalInfo = vi.fn();
const mockSetDetailsCard = vi.fn();
const mockSetProducts = vi.fn();

vi.mock('../../hooks/usePaymentProcess', () => ({
  usePaymentProcess: () => ({
    aceptacion: { permalink: 'https://aceptacion.link' },
    autorizacion: { permalink: 'https://autorizacion.link' },
    handlePayment: mockHandlePayment,
  }),
}));

vi.mock('../../redux/FormCardSlice', () => ({
  setFormData: (payload) => ({ type: 'setFormData', payload }),
}));

const product = {
  name: 'Test Product',
  price: 100000,
  image: 'https://example.com/image.jpg',
};

describe('PaymentSummaryModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSelectorReturn = {
      aceptaTerminos: false,
      autorizaDatos: false,
    };
  });

  test('renderiza modal con producto y precios formateados', () => {
    render(
      <PaymentSummaryModal
        product={product}
        modalInfo={true}
        setModalInfo={mockSetModalInfo}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    );

    expect(screen.getByText('Resumen de Pago')).toBeInTheDocument();
    expect(screen.getByText(product.name)).toBeInTheDocument();

    // Cambiado para buscar todos y validar que haya al menos uno con ese texto
    const priceElements = screen.getAllByText((content) => content.includes('$ 100.000'));
    expect(priceElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/Pagar ahora 💳/)).toBeDisabled();
  });

  test('botón Pagar ahora habilitado cuando checkboxes marcados y se llama handlePayment', () => {
    mockSelectorReturn = {
      aceptaTerminos: true,
      autorizaDatos: true,
    };

    render(
      <PaymentSummaryModal
        product={product}
        modalInfo={true}
        setModalInfo={mockSetModalInfo}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    );

    const btnPagar = screen.getByText(/Pagar ahora 💳/);
    expect(btnPagar).not.toBeDisabled();

    fireEvent.click(btnPagar);
    expect(mockHandlePayment).toHaveBeenCalled();
  });

  test('checkbox Acepto términos dispatch setFormData', () => {
    render(
      <PaymentSummaryModal
        product={product}
        modalInfo={true}
        setModalInfo={mockSetModalInfo}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    );

    const checkboxTerminos = screen.getByLabelText(/Acepto los/i);
    fireEvent.click(checkboxTerminos);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setFormData',
      payload: { aceptaTerminos: true },
    });
  });

  test('checkbox Autorizo datos dispatch setFormData', () => {
    render(
      <PaymentSummaryModal
        product={product}
        modalInfo={true}
        setModalInfo={mockSetModalInfo}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    );

    const checkboxDatos = screen.getByLabelText(/Autorizo datos/i);
    fireEvent.click(checkboxDatos);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'setFormData',
      payload: { autorizaDatos: true },
    });
  });

  test('no renderiza nada si no hay producto', () => {
    const { container } = render(
      <PaymentSummaryModal
        product={null}
        modalInfo={true}
        setModalInfo={mockSetModalInfo}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
