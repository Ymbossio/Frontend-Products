const API_URL = import.meta.env.VITE_URL_BACKEND;

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}products/GetAllProducts`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
