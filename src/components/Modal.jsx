import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { PaymentSummaryModal } from './ModalInfo';
import { validateCard, getCardType } from '../util/functions';

export function PaymentModal({ product, detailsCard, onClose, setDetailsCard, setProducts}) {
    
    if (!product) return null;

    const [modalInfo, setModalInfo] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        numero: '',
        expiracion: '',
        cvv: '',
        ciudad: '',
        direccion: '',
        aceptaTerminos: false,
        autorizaDatos: false,
    });



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const openSummary = (product) => {

        //valido si la tarjeta ingresada es válida o no con el algoritmo de luhn
        if (!validateCard(formData.numero)) {
            alert('⚠️ Tarjeta no válida');
            return;
        }
        
        setSelectedProduct(product);
        setDetailsCard(false);
        setModalInfo(true);

    };

    
    const isFormComplete = () => {
        return (
            formData.nombre.trim() !== '' &&
            formData.numero.trim() !== '' &&
            formData.correo.trim() !== '' &&
            formData.expiracion.trim() !== '' &&
            formData.cvv.trim() !== ''
        );
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
                            <label className="form-label">Nombre del titular</label>
                            <input type="text" name='nombre' value={formData.nombre} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Correo Electrónico</label>
                            <input type="email" name='correo' value={formData.correo} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Número de tarjeta</label>
                            <input type="number" name='numero' value={formData.numero} onChange={handleInputChange} className="form-control" maxLength="16" required />

                                {getCardType(formData.numero) === 'visa' && (
                                <img src="/visa-logo.png" alt="Logo de Visa" style={{ height: 24, marginLeft: 8 }} />  
                                )}
                                {getCardType(formData.numero) === 'mastercard' && (
                                <img src="/mastercard-logo.png" alt="Logo de MasterCard" style={{ height: 24, marginLeft: 8 }} />
                                )}
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-2">
                            <label className="form-label">Fecha de expiración</label>
                            <input type="text" name='expiracion' value={formData.expiracion} onChange={handleInputChange} className="form-control" placeholder="MM/AA" required />
                            </div>
                            <div className="col-md-6 mb-2">
                            <label className="form-label">CVV</label>
                            <input type="tel" name='cvv'value={formData.cvv} onChange={handleInputChange} className="form-control" required />
                            </div>
                        </div>

                        <div className="mb-1">
                            <label className="form-label">Ciudad</label>
                            <input type="text" name='ciudad' value={formData.ciudad} onChange={handleInputChange} className="form-control" required />
                        </div>

                        <div className="mb-1">
                            <label className="form-label">Dirección de entrega</label>
                            <input type="text" name='direccion' value={formData.direccion} onChange={handleInputChange} className="form-control" required />
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
            setFormData={setFormData}
            setDetailsCard={setDetailsCard}
            setProducts={setProducts}
        />
    
    </>
    
  );
}
