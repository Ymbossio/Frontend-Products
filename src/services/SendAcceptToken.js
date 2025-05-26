import { encriptSigns } from "../util/functions";

const URL = import.meta.env.VITE_URL_BASE;
const KEY = import.meta.env.VITE_API_PUBLIC_KEY;

const INTEGRITY = import.meta.env.VITE_KEY_TEST_INTEGRITY;

const CURRENCY = import.meta.env.VITE_CURRENCY;

export const sendAcceptToken= async (total, aceptacion, autorizacion, formData, nameProduct, tokenCard) => {    

/*     const random =  Math.floor(Math.random() * 1000);
    const TotalVenta = total * 100; */

    const random = Math.floor(Math.random() * 1000);
    const TotalVenta = Math.round(total * 100); 

    const reference = nameProduct.split(' ').join('') + random.toString();
    const signsIntegrity = `${reference}${TotalVenta}${CURRENCY}${INTEGRITY}`

    const hashHex = await encriptSigns(signsIntegrity);

  try {
    const response = await fetch(`${URL}transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KEY}`
      },
      body: JSON.stringify(
        {
       
        "acceptance_token": aceptacion,
        "accept_personal_auth": autorizacion,
        "amount_in_cents": TotalVenta,
        "currency": CURRENCY,
        "signature": hashHex,
        "customer_email": formData.correo, 
        "reference": reference,
        "payment_method": {
            "type": "CARD",
            "token": tokenCard,
            "installments": 1
        }
      })
    });  


    if (!response.ok) {
     console.log("error al crear la transacción");
     console.log(response);
     
    }

    const responseData = await response.json();
    console.log('Respuesta:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error al enviar los datos:', error);
  }
};
