import { updateTransference } from '../../services/UpdateTransference';

describe('updateTransference service', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('debe devolver success true y datos cuando la respuesta es exitosa', async () => {
    const mockData = { updated: true };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await updateTransference('tx123', 'PENDING');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('transaction/UpdateTransaction'),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_transaction_gateway: 'tx123',
          status: 'PENDING',
        }),
      }),
    );

    expect(result).toEqual({ success: true, ...mockData });
  });

  test('debe devolver success false si response.ok es false', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    const result = await updateTransference('tx123', 'PENDING');

    expect(result).toEqual({ success: false });
  });

  test('debe devolver success false y mensaje de error si fetch lanza excepción', async () => {
    const errorMessage = 'Network error';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const result = await updateTransference('tx123', 'PENDING');

    expect(result.success).toBe(false);
    expect(result.error).toBe(errorMessage);
  });
});
