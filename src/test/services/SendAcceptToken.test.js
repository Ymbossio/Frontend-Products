import { sendAcceptToken } from '../../services/SendAcceptToken';
import { encriptSigns } from '../../util/functions';

vi.mock('../../util/functions', () => ({
  encriptSigns: vi.fn(),
}));

global.fetch = vi.fn();

describe('sendAcceptToken service', () => {
  const mockURL = import.meta.env.VITE_URL_BASE;
  const mockKEY = import.meta.env.VITE_API_PUBLIC_KEY;
  const mockCURRENCY = import.meta.env.VITE_CURRENCY;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const total = 10;
  const aceptacion = 'aceptacion-token';
  const autorizacion = 'autorizacion-token';
  const formData = { correo: 'test@example.com' };
  const nameProduct = 'Test Product';
  const tokenCard = 'token123';

  it('debe enviar la petición con el body correcto y retornar data', async () => {
    // Mock de encriptSigns para devolver un hash fijo
    encriptSigns.mockResolvedValue('hashFake123');

    // Mock fetch para devolver una respuesta ok y JSON con data
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, id: 'transf123' }),
    });

    const result = await sendAcceptToken(total, aceptacion, autorizacion, formData, nameProduct, tokenCard);

    expect(encriptSigns).toHaveBeenCalled();

    expect(fetch).toHaveBeenCalledWith(`${mockURL}transactions`, expect.objectContaining({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockKEY}`,
      },
      body: expect.any(String),
    }));

    // Verificamos que el body JSON incluye los campos esperados
    const bodySent = JSON.parse(fetch.mock.calls[0][1].body);
    expect(bodySent.acceptance_token).toBe(aceptacion);
    expect(bodySent.accept_personal_auth).toBe(autorizacion);
    expect(bodySent.currency).toBe(mockCURRENCY);
    expect(bodySent.customer_email).toBe(formData.correo);
    expect(bodySent.payment_method.token).toBe(tokenCard);
    expect(bodySent.reference.startsWith('TestProduct')).toBe(true); // reference sin espacios + número random

    // El resultado debe ser el JSON retornado por fetch
    expect(result).toEqual({ success: true, id: 'transf123' });
  });

  it('debe mostrar error en consola si fetch falla', async () => {
    encriptSigns.mockResolvedValue('hashFake123');
    fetch.mockRejectedValue(new Error('Network Error'));

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await sendAcceptToken(total, aceptacion, autorizacion, formData, nameProduct, tokenCard);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error al enviar los datos:', expect.any(Error));
    expect(result).toBeUndefined();

    consoleErrorSpy.mockRestore();
  });

  it('debe manejar correctamente una respuesta no OK del servidor', async () => {
  encriptSigns.mockResolvedValue('hashFake123');

  const mockResponse = {
    ok: false,
    json: () => Promise.resolve({ error: 'Bad Request' })
  };

  fetch.mockResolvedValue(mockResponse);

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  const result = await sendAcceptToken(total, aceptacion, autorizacion, formData, nameProduct, tokenCard);

  expect(consoleLogSpy).toHaveBeenCalledWith(mockResponse);
  expect(result).toEqual({ error: 'Bad Request' });

  consoleLogSpy.mockRestore();
});


});
