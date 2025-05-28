const URL = import.meta.env.VITE_URL_BASE;
const KEY = import.meta.env.VITE_API_PUBLIC_KEY;

export const tokenizacionCard = async ({ numero, cvv, expiracion, nombre }) => {

    let [mes, anio] = expiracion.split('/');

    try {
        const response = await fetch(`${URL}tokens/cards`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${KEY}`
        },
        body: JSON.stringify(
        {
            "number":numero, 
            "cvc": cvv, 
            "exp_month": mes, 
            "exp_year": anio, 
            "card_holder": nombre
            })
        });    

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error en la respuesta del servidor: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};
