
const API_URL = import.meta.env.VITE_URL_BASE;

export const getTransferenceById = async (tokenCard) => {
    try {
    const response = await fetch(`${API_URL}transactions/${tokenCard}`,{
      method: 'GET'
    });
   
    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return { success: true, ...data };
  } catch (error) {
    console.error('Error get transactions:', error);
    return [];
  }
};  