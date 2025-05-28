import { createTransferInternal } from '../../services/CreateTransferInternal';

global.fetch = vi.fn();

describe('createTransferInternal service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockIdTransfer = 'trx123';
  const mockPaymentMethod = 'card';
  const mockTypeCard = 'Visa';
  const mockCardHolder = 'Juan Pérez';
  const mockStatus = 'PENDING';

  it('devuelve éxito con datos si la respuesta es correcta', async () => {
    const mockResponseData = { id: 1, status: 'CREATED' };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await createTransferInternal(
      mockIdTransfer,
      mockPaymentMethod,
      mockTypeCard,
      mockCardHolder,
      mockStatus,
    );

    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_URL_BACKEND}transaction/CreateTransaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_transaction_gateway: mockIdTransfer,
        payment_method: mockPaymentMethod,
        type_card: mockTypeCard,
        card_holder: mockCardHolder,
        status: mockStatus,
      }),
    });

    expect(result).toEqual({ success: true, data: mockResponseData });
  });

  it('devuelve error si la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    const result = await createTransferInternal(
      mockIdTransfer,
      mockPaymentMethod,
      mockTypeCard,
      mockCardHolder,
      mockStatus,
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Error en la solicitud: 500');
  });

  it('maneja error de red correctamente', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await createTransferInternal(
      mockIdTransfer,
      mockPaymentMethod,
      mockTypeCard,
      mockCardHolder,
      mockStatus,
    );

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });
});
