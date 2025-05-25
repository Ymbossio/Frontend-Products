const API_URL = import.meta.env.VITE_URL_BACKEND;


export const createTransferInternal = async (id_transfer, payment_method, type_card, card_holder, status) => {
      try {
    const response = await fetch(`${API_URL}transaction/CreateTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({
            id_transaction_gateway: id_transfer,
            payment_method: payment_method,
            type_card: type_card,
            card_holder: card_holder,
            status: status
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