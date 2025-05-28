import { getTransferenceById } from '../../services/GetTransferById';

global.fetch = vi.fn();

describe('getTransferenceById service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTokenCard = 'token123';

  it('devuelve datos y success true si la respuesta es correcta', async () => {
    const mockResponseData = { data: { id: 'transf123', status: 'PENDING' } };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await getTransferenceById(mockTokenCard);

    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_URL_BASE}transactions/${mockTokenCard}`, {
      method: 'GET',
    });

    expect(result).toEqual({ success: true, ...mockResponseData });
  });

  it('devuelve un arreglo vacío si la respuesta no es ok', async () => {
    fetch.mockResolvedValue({ ok: false });

    const result = await getTransferenceById(mockTokenCard);

    expect(result).toEqual([]);
  });

  it('devuelve un arreglo vacío si ocurre un error', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const result = await getTransferenceById(mockTokenCard);

    expect(result).toEqual([]);
  });
});
