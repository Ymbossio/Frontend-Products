import { updateStock } from '../../services/UpdateStock';

describe('updateStock service', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('debe devolver success true y datos al actualizar correctamente', async () => {
    const mockResponseData = { updated: true };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const result = await updateStock(1, 10);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('stock/UpdateStockProduct'),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_products: 1, available: 10 }),
      }),
    );

    expect(result).toEqual({ success: true, ...mockResponseData });
  });

  test('debe devolver success false si response.ok es false', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    const result = await updateStock(1, 10);

    expect(result).toEqual({ success: false });
  });

  test('debe devolver success false y mensaje de error si fetch lanza excepción', async () => {
    const errorMessage = 'Network error';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const result = await updateStock(1, 10);

    expect(result.success).toBe(false);
    expect(result.error).toBe(errorMessage);
  });
});
