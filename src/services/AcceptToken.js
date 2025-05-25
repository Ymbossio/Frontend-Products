const URL = import.meta.env.VITE_URL_BASE;
const KEY = import.meta.env.VITE_API_PUBLIC_KEY;

export const accepToken = async () => {
  try {
    const response = await fetch(`${URL}merchants/${KEY}`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    throw error;
  }
};
