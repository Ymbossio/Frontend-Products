import React from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { clearTransactionData } from '../redux/TransactionSlice';
import { resetForm } from '../redux/FormCardSlice';

export const PurchaseDetails = ({ setShowSuccessModal, setDetailsCard }) => {
  const dispatch = useDispatch();
  const data = JSON.parse(localStorage.getItem('transaction'));

  const handleClose = () => {
    setShowSuccessModal(false);
    setDetailsCard(false);
    localStorage.removeItem('transaction');
    dispatch(clearTransactionData());
    dispatch(resetForm());
    toast.success('✅ Pago realizado exitosamente');
  };

  if (!data) return null;

  const monto = data.amount_in_cents / 100;
  const ultimos4 = data?.payment_method?.extra?.last_four || '****';
  const tarjeta = data?.payment_method?.extra?.name || 'Tarjeta';
  const fecha = new Date(data.created_at).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const status = data?.status;
  const mensajeError = data?.status_message;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-sm modal-dialog-scrollable">
        <div className="modal-content">
          <div className={`modal-header text-white ${status === 'APPROVED' ? 'bg-success' : status == 'PENDING' ? 'bg-warning' : 'bg-danger'}`}>
            <h5 className="modal-title" id="successModalLabel">
              {status == 'APPROVED' ? '✅ ¡Transacción Exitosa!' : status == 'PENDING' ? '🕒 Transacción Pendiente' : '❌ Transacción Fallida'}
            </h5>
          </div>
          <div className="modal-body text-center">
            <i className={`bi bi-${status === 'APPROVED' ? 'check-circle-fill text-success' : 'x-circle-fill text-danger'}`} style={{ fontSize: '2rem' }}></i>
            <p className="mt-3 mb-1 fw-bold">
              {status === 'APPROVED' ? 'Pago realizado con éxito' : status == 'PENDING' ? 'Pago pendiente' : 'No se pudo procesar el pago'}
            </p>
            <p className="mb-2">Monto: <strong>${monto.toLocaleString('es-CO')} COP</strong></p>
            <p className="mb-2">Tarjeta: <strong>{tarjeta}</strong></p>
            <p className="mb-2">Últimos 4 dígitos: **** **** **** <strong>{ultimos4}</strong></p>
            <p className="text-muted small mb-0">Fecha: {fecha}</p>
            <p className="text-muted small">ID de transacción: <code>{data.id}</code></p>

            {
              status == 'APPROVED' ?
                <div className="alert alert-success mt-2 p-2">
                  <small>Transacción realizada con éxito</small>
                </div>
              : status == 'PENDING' ?
                <div className="alert alert-warning mt-2 p-2">
                  <small>El pago se procesará en breve</small>
                </div>
              : 
              <div className="alert alert-info mt-2 p-2">
                  <small>Error al procesar el pago</small>
                </div>
            }
          </div>
          <div className="modal-footer justify-content-center">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
