import { createDeliveries } from '../../services/CreateDeliveries';

global.fetch = vi.fn();

describe('createDeliveries service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockName = 'Juan Pérez';
  const mockAddress = 'Calle Falsa 123';
  const mockId = 'trx123';

  it('devuelve éxito con datos si la respuesta es correcta', async () => {
    const mockResponseData = { id: 1, status: 'CREATED' };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await createDeliveries(mockName, mockAddress, mockId);

    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_URL_BACKEND}deliveries/CreateDeliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        names: mockName,
        address: mockAddress,
        id_transaction: mockId,
      }),
    });

    expect(result).toEqual({ success: true, data: mockResponseData });
  });

  it('devuelve error si la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    const result = await createDeliveries(mockName, mockAddress, mockId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Error en la solicitud: 500');
  });

  it('maneja error de red correctamente', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await createDeliveries(mockName, mockAddress, mockId);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });
});
