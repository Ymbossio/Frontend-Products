import { useState, useEffect } from 'react';
import { accepToken } from '../services/AcceptToken';
import { sendAcceptToken } from '../services/SendAcceptToken';
import { tokenizacionCard } from '../services/TokenizacionCard';
import { updateStock } from '../services/UpdateStock';
import { fetchProducts } from '../api/products';
import { createDeliveries } from '../services/CreateDeliveries';
import { createTransferInternal } from '../services/CreateTransferInternal';
import { getTransferenceById } from '../services/GetTransferById';
import { updateTransference } from '../services/UpdateTransference';
import { toast } from 'sonner';

export function usePaymentProcess({ formData, setProducts, setModalInfo, setDetailsCard }) {
  const [aceptacion, setAceptacion] = useState('');
  const [autorizacion, setAutorizacion] = useState('');

  useEffect(() => {
    const getTokens = async () => {
      try {
        const { data } = await accepToken();
        setAceptacion(data.presigned_acceptance.acceptance_token);
        setAutorizacion(data.presigned_personal_data_auth.acceptance_token);
      } catch (err) {
        console.error('Error obteniendo términos:', err);
      }
    };

    getTokens();
  }, []);

  const handlePayment = async (product, total) => {
    const btnPagar = document.getElementById('btn-pagar');
    btnPagar.disabled = true;

    try {
      const data = await tokenizacionCard(formData);
      if (data.status !== "CREATED") throw new Error('Error al obtener el token');

      const tokenId = data.data.id;

      const responseData = await sendAcceptToken(total, aceptacion, autorizacion, formData, product.name, tokenId);
      if (responseData.data?.status !== "PENDING") throw new Error('Error al crear la transacción');

      const id_transfer = responseData.data.id;
      const { type: payment_method, extra } = responseData.data.payment_method;
      const { brand: type_card, card_holder } = extra;
      const status = responseData.data.status;

      const internalRes = await createTransferInternal(id_transfer, payment_method, type_card, card_holder, status);
      if (!internalRes.success) throw new Error('Error al crear transacción interna');

      const transferenceStatus = await getTransferenceById(id_transfer);
      console.log("transferenceStatus", transferenceStatus);
      if (!transferenceStatus.success) throw new Error('Error al consultar transacción');

      const updated = await updateTransference(id_transfer, transferenceStatus.data.status);
      if (!updated.success) throw new Error('Error al actualizar transacción');

      const stockUpdated = await updateStock(product.id, product.stock);
      if (!stockUpdated.success) throw new Error('Error al actualizar stock');

      const deliveryCreated = await createDeliveries(formData.nombre, formData.direccion, id_transfer);
      if (!deliveryCreated.success) throw new Error('Error al crear entrega');

      await fetchProducts().then(setProducts);
      toast.success('✅ Pago realizado exitosamente');

      setModalInfo(false);
      setDetailsCard(false);
    } catch (error) {
      toast.error('❌ Error en el pago: ' + error.message);
      btnPagar.disabled = false;
    }
  };

  return { aceptacion, autorizacion, handlePayment };
}
