
const API_URL = import.meta.env.VITE_URL_BACKEND;

export const updateStock = async (id, stock) => {
  try {
    const response = await fetch(`${API_URL}stock/UpdateStockProduct`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_products: id, 
        available: stock
      }),
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    
    return { success: true, ...data };
  } catch (error) {
    console.error('Error updating stock:', error);
    return { success: false, error: error.message };
  }
};
