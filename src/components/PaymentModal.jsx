import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { PaymentSummaryModal } from './PaymentSummaryModal';
import { validateCard, getCardType } from '../util/functions';
import { usePaymentForm } from '../hooks/usePaymentForms';
import { toast } from 'sonner';
import { PatternFormat } from 'react-number-format';
import { setFormData } from '../redux/FormCardSlice';
import { useDispatch } from 'react-redux';


export function PaymentModal({ product, detailsCard, onClose, setDetailsCard, setProducts}) {
    if (!product) return null;
    
    const [modalInfo, setModalInfo] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();

    const {
      formData,
      handleInputChange,
      isFormComplete
    } = usePaymentForm();

  
    const openSummary = () => {
        
        //valido si la tarjeta ingresada es válida o no con el algoritmo de luhn
        if (!validateCard(formData.numero)) {
        toast.error('⚠️ Tarjeta no válida');
        return;
        }
        
        setSelectedProduct(product);
        setDetailsCard(false);
        setModalInfo(true);

    };


    const validateCVV = (cvv) => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};


  return (
    <>
        <div className={`modal fade ${detailsCard ? 'show d-block' : '' }`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Pagar {product.name}</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-2">
                            <label htmlFor='nombre' className="form-label">Nombre del titular</label>
                            <input type="text" id='nombre' name='nombre' value={formData.nombre} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor='correo' className="form-label">Correo Electrónico</label>
                            <input type="email" id='correo' name='correo' value={formData.correo} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor='numero' className="form-label">Número de tarjeta</label>
                           <PatternFormat id="numero" name="numero" value={formData.numero} onValueChange={(values) => {
    dispatch(setFormData({ numero: values.value }));
  }} format="#### #### #### ####" allowEmptyFormatting mask="-" className="form-control" required/>
                                {getCardType(formData.numero) === 'visa' && (
                                <img src="/visa-logo.png" alt="Logo de Visa" style={{ height: 24, marginLeft: 8 }} />  
                                )}
                                {getCardType(formData.numero) === 'mastercard' && (
                                <img src="/mastercard-logo.png" alt="Logo de MasterCard" style={{ height: 24, marginLeft: 8 }} />
                                )}
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-2">
                            <label htmlFor='expiracion' className="form-label">Fecha de expiración</label>
                            <PatternFormat id="expiracion" name="expiracion" value={formData.expiracion}   onValueChange={(values) => {
    dispatch(setFormData({ expiracion: values.formattedValue }));
  }}format="##/##" placeholder="MM/AA" mask={['M', 'M', 'A', 'A']} className="form-control" required/>
                            </div>
                            <div className="col-md-6 mb-2">
                            <label htmlFor='cvv' className="form-label">CVV</label>
                            <input type="number" id='cvv' name='cvv'value={formData.cvv} onChange={handleInputChange} className="form-control" required />
                            </div>
                        </div>

                        <div className="mb-1">
                            <label htmlFor='ciudad' className="form-label">Ciudad</label>
                            <input id='ciudad' type="text" name='ciudad' value={formData.ciudad} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="mb-1">
                            <label htmlFor='direccion' className="form-label">Dirección de entrega</label>
                            <input id='direccion' type="text" name='direccion' value={formData.direccion} onChange={handleInputChange} className="form-control" required />
                        </div>


                    </form>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn btn-primary" disabled={!isFormComplete()} onClick={() => openSummary(product)}>Continuar ➡️</button>
                </div>
                </div>
            </div>
        </div>

        <PaymentSummaryModal
            product={selectedProduct}
            modalInfo={modalInfo}
            setModalInfo={setModalInfo}
            formData={formData}
            setDetailsCard={setDetailsCard}
            setProducts={setProducts}
        />
    
    </>
    
  );
}
