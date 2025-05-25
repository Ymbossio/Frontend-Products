const API_URL = import.meta.env.VITE_URL_BACKEND;


export const createDeliveries = async (name, addres, id) => {
      try {
    const response = await fetch(`${API_URL}deliveries/CreateDeliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({
            names: name,
            address: addres,
            id_transaction: id
        })
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
    
  
} catch (error) {
    console.error('Error al enviar los datos:', error);
    return { success: false, error: error.message };
  }
};