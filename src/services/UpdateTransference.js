const API_URL = import.meta.env.VITE_URL_BACKEND;

export const updateTransference = async (id_transaction_gateway, status) => {
  try {
    const response = await fetch(`${API_URL}transaction/UpdateTransaction`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id_transaction_gateway: id_transaction_gateway,
        status: status
      })
    });

     if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    
    return { success: true, ...data };
  } catch (error) {
    console.error('Error al enviar los datos:', error);
    return { success: false, error: error.message };
  }
};