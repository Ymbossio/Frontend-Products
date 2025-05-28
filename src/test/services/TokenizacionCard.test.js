import { tokenizacionCard } from '../../services/TokenizacionCard';

global.fetch = vi.fn();

describe('tokenizacionCard service', () => {
  const mockURL = import.meta.env.VITE_URL_BASE;
  const mockKEY = import.meta.env.VITE_API_PUBLIC_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const cardData = {
    numero: '4242424242424242',
    cvv: '123',
    expiracion: '12/25',
    nombre: 'Juan Perez',
  };

  it('debe enviar la petición correctamente y retornar data', async () => {
    const mockResponseData = { status: 'CREATED', data: { id: 'token123' } };

    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await tokenizacionCard(cardData);

    expect(fetch).toHaveBeenCalledWith(`${mockURL}tokens/cards`, expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockKEY}`,
      },
      body: JSON.stringify({
        number: cardData.numero,
        cvc: cardData.cvv,
        exp_month: '12',
        exp_year: '25',
        card_holder: cardData.nombre,
      }),
    }));

    expect(result).toEqual(mockResponseData);
  });

  it('debe lanzar error con mensaje si la respuesta no es ok', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      text: () => Promise.resolve('Bad Request'),
    });

    await expect(tokenizacionCard(cardData)).rejects.toThrow('Error en la respuesta del servidor: 400 - Bad Request');
  });

  it('debe lanzar error si fetch falla', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    await expect(tokenizacionCard(cardData)).rejects.toThrow('Network error');
  });
});
