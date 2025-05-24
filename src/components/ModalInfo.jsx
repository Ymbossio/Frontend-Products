
export function PaymentSummaryModal({ product, show, onClose, onConfirm }) {
  if (!product) return null;

  const tarifaBase = product.price;
  const tarifaEnvio = product.price + 1500000;
  const total = parseFloat(tarifaBase) + tarifaBase + tarifaEnvio;


 const getCardType = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    return null;
  };


  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Resumen de Pago</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">

            <div className="mb-3 text-center">
                <img src={product.image} alt={product.name} className="img-fluid" style={{ maxHeight: '80px', objectFit: 'contain' }}/>
                <h6>{product.name}</h6>
                <p className="fw-bold text-primary">Precio: ${product.price}</p>
            </div>

            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between">
                <span>Importe del producto</span>
                <strong>${parseFloat(product.price).toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Tarifa base</span>
                <strong>${tarifaBase.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Tarifa de envío</span>
                <strong>${tarifaEnvio.toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Total</span>
                <strong className="text-success">${total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" onClick={onConfirm}>Pagar ahora 💳</button>
          </div>
        </div>
      </div>
    </div>
  );
}
