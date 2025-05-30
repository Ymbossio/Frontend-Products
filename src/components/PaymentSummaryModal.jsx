import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { formatoCOP } from "../util/functions";
import { usePaymentProcess } from '../hooks/usePaymentProcess';
import { useDispatch, useSelector } from 'react-redux';
import { setFormData } from '../redux/FormCardSlice'
import { PurchaseDetails } from './PurchaseDetails';

export function PaymentSummaryModal({ product, modalInfo, setModalInfo, setDetailsCard, setProducts }) {
  const dispatch = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formData = useSelector((state) => state.paymentForm);
  const { aceptacion, autorizacion, handlePayment } = usePaymentProcess({ formData, setProducts, setModalInfo, setDetailsCard, showSuccessModal,setShowSuccessModal });
  
  if (!product) return null;

  
  const iva = 0.19;
  const tarifaBase = product.price * (1 + iva / 100);
  const tarifaEnvio = 15000;
  const importProduct = product.price;

  const rawTotal = tarifaBase + importProduct + tarifaEnvio;
  const total = Math.round(rawTotal); 




  const handleGoBack = () => {
    setDetailsCard(true);
    setModalInfo(false);
  };

  return (
    <>
      {modalInfo && (
        <div className={`modal fade show d-block`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resumen de Pago</h5>
              </div>
              <div className="modal-body">
                {/* Info Producto */}
                <div className="mb-3 text-center">
                  <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '80px', objectFit: 'contain' }} />
                  <h6>{product.name}</h6>
                  <p className="fw-bold text-primary">Precio: {formatoCOP.format(product.price)}</p>
                </div>

                {/* Resumen de valores */}
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between">
                    <span>Importe del producto</span>
                    <strong>{formatoCOP.format(importProduct)}</strong>
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

                {/* Términos */}
                <div className="list-group-item mb-2">
                  <input className="form-check-input" type="checkbox" id="terminos" checked={formData.aceptaTerminos} onChange={(e) => dispatch(setFormData({ aceptaTerminos: e.target.checked }))} />
                  <label className="form-check-label" htmlFor="terminos">Acepto los <a href={aceptacion.permalink} target="_blank" rel="noopener noreferrer">Términos</a></label>
                </div>

                <div className="list-group-item mb-2">
                  <input className="form-check-input" type="checkbox" id="datos" checked={formData.autorizaDatos}  onChange={(e) => dispatch(setFormData({ autorizaDatos: e.target.checked }))} />
                  <label className="form-check-label" htmlFor="datos">Autorizo datos según <a href={autorizacion.permalink} target="_blank" rel="noopener noreferrer">Wompi</a></label>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleGoBack}>Regresar</button>
                <button id="btn-pagar" className="btn btn-success" disabled={!formData.aceptaTerminos || !formData.autorizaDatos} onClick={() => handlePayment(product, total)}>Pagar ahora 💳</button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    { showSuccessModal && (
        <PurchaseDetails 
          setShowSuccessModal={setShowSuccessModal}
          setDetailsCard={setDetailsCard}
        />
      )
    }

      
      <Toaster position="top-right" />
    </>
  );
}
