import { useState, useEffect } from "react";
import { accepToken } from "../services/AcceptToken";
import { sendAcceptToken } from "../services/SendAcceptToken";
import { Toaster, toast } from 'sonner';
import { tokenizacionCard } from "../services/TokenizacionCard";
import { formatoCOP } from "../util/functions";
import { updateStock } from "../services/UpdateStock";
import { fetchProducts } from "../api/products";
import { createDeliveries } from "../services/CreateDeliveries";
import { createTransferInternal} from "../services/CreateTransferInternal";
import { getTransferenceById } from "../services/GetTransferById";
import { updateTransference } from "../services/UpdateTransference";


export function PaymentSummaryModal({ product, modalInfo, setModalInfo, formData, setFormData, setDetailsCard, setProducts }) {
  if (!product) return null;

  const iva = 0.19;

  const tarifaBase = product.price * (1 + iva / 100);

  const tarifaEnvio = 15000;  
  const importProduct = product.price * 1;

  const total = tarifaBase + importProduct + tarifaEnvio;



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


  const handdleGoBack = () => {
    setDetailsCard(true); 
    setModalInfo(false);
  };


  const continuarConPago = async () => {
    
    const btnPagar = document.getElementById('btn-pagar');
    btnPagar.disabled = true;

    try {
      
      const  data  = await tokenizacionCard(formData);
      
      if (data.status !== "CREATED") {
        throw new Error('Error al obtener el token Users');
      }

      const { id } = data.data;
      
      //invoco al servicio de crear la transacción a la pasarela
      const responseData = await sendAcceptToken(total, aceptacion, autorizacion, formData, product.name, id);
      
      if (responseData.data?.status !== "PENDING") {
        throw new Error('Error al crear la transacción');
      }

      console.log(responseData);
      

      //propiedades necesarias para la creacion de la transaccion en estando pending
       const id_transfer = responseData.data.id;
       const payment_method = responseData.data.payment_method.type;
       const type_card = responseData.data.payment_method.extra.brand;
       const card_holder = responseData.data.payment_method.extra.card_holder;
       const status = responseData.data.status;
       
      //invoco el servicio de crear transaccion al internal
      const responseTransferInternal = await createTransferInternal(id_transfer, payment_method, type_card, card_holder, status);
      if(!responseTransferInternal.success){
        throw new Error('Error al crear la transacción interna');
      }

      //consultar estado de la transaccion
      const responseCreateTranfer = await getTransferenceById(id_transfer);
      console.log("responseCreateTranfer", responseCreateTranfer);
      if(!responseCreateTranfer.success){
        throw new Error('Error al consultar la transacción');
      }

      //actualizacion del estado de la transaccion internal
      const responseUpdateTranfer = await updateTransference(id_transfer, responseCreateTranfer.data.status);
      if(!responseUpdateTranfer.success){
        throw new Error('Error al actualizar la transacción');
      }

      //invoco al servicio de  actualizar stock
      const responseServiceStock =await updateStock(product.id, product.stock);    
      if(!responseServiceStock.success){
        throw new Error('Error al actualizar stock');
      }

      //propiedades necesarias para la creacion del deliveries
       const id_transaction = responseData.data.id;
       const name_client = formData.nombre;
       const address = formData.direccion;

      //invoco el servicio deliveries (crear entrega)
      const responseDeliveries = await createDeliveries(name_client, address, id_transaction);
      if(!responseDeliveries.success){
        throw new Error('Error al crear la entrega');
      }

      await fetchProducts().then(setProducts);
      toast.success('Pago realizado exitosamente');
      setModalInfo(false);
      setDetailsCard(false);
    

    } catch (error) {
      btnPagar.disabled = true;
      throw new Error(error);
    }
    

  };


  return (
    <>

    {
      modalInfo && (
      <div className={`modal fade ${modalInfo ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Resumen de Pago</h5>
            </div>
            <div className="modal-body">

              <div className="mb-3 text-center">
                  <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '80px', objectFit: 'contain' }}/>
                  <h6>{product.name}</h6>
                  <p className="fw-bold text-primary">Precio: {formatoCOP.format(product.price)}</p>
              </div>

              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between">
                  <span>Importe del producto</span>
                  <strong>{formatoCOP.format(parseFloat(importProduct))}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Tarifa base</span>
                  <strong>{formatoCOP.format(tarifaBase)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Tarifa de envío</span>
                  <strong>{formatoCOP.format(tarifaEnvio)}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total</span>
                  <strong className="text-success">{formatoCOP.format(total)}</strong>
                </li>
              </ul>

              <div className="list-group-item mb-2 ">
                <input className="form-check-input" type="checkbox" id="terminos" checked={formData.aceptaTerminos} onChange={(e) => setFormData({ ...formData, aceptaTerminos: e.target.checked })}/>
                <label className="form-check-label" htmlFor="terminos">He leído y acepto los <a href={aceptacion.permalink} target="_blank" rel="noopener noreferrer">Términos y Condiciones</a></label>
              </div>

              <div className="list-group-item mb-2 ">
                <input className="form-check-input" type="checkbox" id="datos" checked={formData.autorizaDatos} onChange={(e) =>setFormData({ ...formData, autorizaDatos: e.target.checked })}/>
                <label className="form-check-label" htmlFor="datos"> Autorizo el uso de mis datos personales según lo establecido por <br/> <a href={autorizacion.permalink} target="_blank" rel="noopener noreferrer">Wompi</a></label>
              </div>

            </div>
          


            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handdleGoBack}>Regresar</button>
              <button id="btn-pagar" className="btn btn-success"
                disabled={!formData.aceptaTerminos || !formData.autorizaDatos}
                onClick={continuarConPago} >Pagar ahora 💳</button>
            </div>
          </div>
        </div>
      </div>

      )
    }
 <Toaster position="top-right"/>

</>
  );
}
