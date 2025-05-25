import { useState, useEffect } from "react";
import { accepToken } from "../services/AcceptToken";
import { createTranfer } from "../services/CreateTranfer";
import { Toaster, toast } from 'sonner';
import { tokenizacionCard } from "../services/TokenizacionCard";
import { formatoCOP } from "../util/functions";


export function PaymentSummaryModal({ product, modalInfo, setModalInfo, formData, setFormData, setDetailsCard }) {
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
      
      const responseData = await createTranfer(total, aceptacion, autorizacion, formData, product.name, id);
      if (responseData.success) {
        
        toast.success('Pago realizado exitosamente');
        setModalInfo(false);
        setDetailsCard(false);

      }

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
