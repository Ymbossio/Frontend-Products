import {fetchProducts} from '../../api/products';
import { vi } from 'vitest';

global.fetch = vi.fn();

describe('fetchProducts', () => {
  const mockAPIResponse = [{ id: 1, name: 'Product A' }];

  beforeEach(() => {
     vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('devuelve productos si la respuesta es exitosa', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAPIResponse,
    });

    const result = await fetchProducts();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('products/GetAllProducts'));
    expect(result).toEqual(mockAPIResponse);
  });

  test('devuelve [] si la respuesta no es ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await fetchProducts();
    expect(result).toEqual([]);
  });

  test('devuelve [] si fetch lanza un error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchProducts();
    expect(result).toEqual([]);
  });
});
