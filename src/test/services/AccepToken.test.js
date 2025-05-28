import { accepToken } from '../../services/AcceptToken';

global.fetch = vi.fn();

describe('accepToken service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devuelve los datos si la respuesta es exitosa', async () => {
    const mockResponse = {
      presigned_acceptance: { acceptance_token: 'token123' },
      presigned_personal_data_auth: { acceptance_token: 'token456' }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const data = await accepToken();

    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.VITE_URL_BASE}merchants/${import.meta.env.VITE_API_PUBLIC_KEY}`, {
      method: 'GET'
    });

    expect(data).toEqual(mockResponse);
  });

  it('lanza error si la respuesta no es exitosa', async () => {
    fetch.mockResolvedValue({
      ok: false
    });

    await expect(accepToken()).rejects.toThrow('Error en la respuesta del servidor');
  });

  it('lanza error si fetch falla', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    await expect(accepToken()).rejects.toThrow('Network error');
  });
});
