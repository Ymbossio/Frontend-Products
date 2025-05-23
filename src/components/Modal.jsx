import { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { PaymentSummaryModal } from './ModalInfo';

export function PaymentModal({ product, show, onClose }) {

    const [showSummary, setShowSummary] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const [formData, setFormData] = useState({ 
        nombre: '',
        numero: '',
        expiracion: '',
        cvv: '',
    })

  if (!product) return null;


    const openSummary = (product) => {
        setSelectedProduct(product);
        setShowSummary(true);

    };

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleConfirmPayment = () => {
        setShowSummary(false);
        onClose();
        alert('💳 Pago procesado correctamente');
    };

    
    const isFormComplete = () => {
    return (
        formData.nombre.trim() !== '' &&
        formData.numero.trim() !== '' &&
        formData.expiracion.trim() !== '' &&
        formData.cvv.trim() !== ''
    );


};

  return (
    <>
        <div className={`modal fade ${show ? 'show d-block' : '' }`} tabIndex="-1"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        aria-modal="true"
        role="dialog">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Pagar {product.name}</h5>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-2">
                        <label className="form-label">Nombre en la tarjeta</label>
                        <input type="text" name='nombre' className="form-control" onChange={handleInput} required />
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Número de tarjeta</label>
                        <input type="number" name='numero' className="form-control" maxLength="16" onChange={handleInput} required />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-2">
                        <label className="form-label">Fecha de expiración</label>
                        <input type="month" name='expiracion' className="form-control" placeholder="MM/AA" onChange={handleInput} required />
                        </div>
                        <div className="col-md-6 mb-2">
                        <label className="form-label">CVV</label>
                        <input type="number" name='cvv' className="form-control" onChange={handleInput} required />
                        </div>
                    </div>

                    <div className="mb-1">
                        <label className="form-label">Dirección de entrega</label>
                        <input type="text" name='direccion' className="form-control" onChange={handleInput} required />
                    </div>

                    <div className="mb-1">
                        <label className="form-label">Ciudad</label>
                        <input type="text" name='ciudad' className="form-control" onChange={handleInput} required />
                    </div>

                    <div className="mb-1">
                        <label className="form-label">Código Postal</label>
                        <input type="text" name='postal' className="form-control" onChange={handleInput} required />
                    </div>

                </form>
            </div>
            <div className="modal-footer">
                <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button className="btn btn-success" disabled={!isFormComplete()} onClick={() => openSummary(product)}>Pagar con Tarjetas de Crédito 💳</button>
            </div>
            </div>
        </div>
        </div>

        <PaymentSummaryModal
            product={selectedProduct}
            show={showSummary}
            onClose={() => setShowSummary(false)}
            onConfirm={handleConfirmPayment}
        />
    
    </>
    
  );
}
