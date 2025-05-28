import { renderHook, act, waitFor } from '@testing-library/react';
import { usePaymentProcess } from '../../hooks/usePaymentProcess';
import * as accepTokenService from '../../services/AcceptToken';
import * as tokenizacionCardService from '../../services/TokenizacionCard';
import * as sendAcceptTokenService from '../../services/SendAcceptToken';
import * as createTransferInternalService from '../../services/CreateTransferInternal';
import * as getTransferenceByIdService from '../../services/GetTransferById';
import * as updateTransferenceService from '../../services/UpdateTransference';
import * as updateStockService from '../../services/UpdateStock';
import * as createDeliveriesService from '../../services/CreateDeliveries';
import * as fetchProductsApi from '../../api/products';
import { setTransactionData } from '../../redux/TransactionSlice';
import { vi } from 'vitest';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../redux/TransactionSlice', () => ({
  setTransactionData: vi.fn((payload) => ({ type: 'setTransactionData', payload })),
}));

const mockDispatch = vi.fn();
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe('usePaymentProcess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<button id="btn-pagar"></button>';
  });

  test('obtiene tokens y los guarda en el estado', async () => {
    vi.spyOn(accepTokenService, 'accepToken').mockResolvedValue({
      data: {
        presigned_acceptance: { acceptance_token: 'tokenAceptacion' },
        presigned_personal_data_auth: { acceptance_token: 'tokenAutorizacion' },
      },
    });

    const { result } = renderHook(() =>
      usePaymentProcess({
        formData: {},
        setProducts: () => {},
        setModalInfo: () => {},
        setDetailsCard: () => {},
      }),
    );

    await waitFor(() => {
      expect(result.current.aceptacion).toBe('tokenAceptacion');
      expect(result.current.autorizacion).toBe('tokenAutorizacion');
    });
  });

  test('handlePayment completa el flujo exitosamente', async () => {
    const fakeFormData = { nombre: 'Juan', direccion: 'Calle falsa 123' };
    const fakeProduct = { id: 1, name: 'Producto', stock: 5 };

    // Mock services
    vi.spyOn(accepTokenService, 'accepToken').mockResolvedValue({
      data: {
        presigned_acceptance: { acceptance_token: 'tokenAceptacion' },
        presigned_personal_data_auth: { acceptance_token: 'tokenAutorizacion' },
      },
    });
    vi.spyOn(tokenizacionCardService, 'tokenizacionCard').mockResolvedValue({
      status: 'CREATED',
      data: { id: 'token123' },
    });
    vi.spyOn(sendAcceptTokenService, 'sendAcceptToken').mockResolvedValue({
      data: {
        id: 'transf123',
        status: 'PENDING',
        payment_method: {
          type: 'card',
          extra: { brand: 'Visa', card_holder: 'Juan' },
        },
      },
    });
    vi.spyOn(createTransferInternalService, 'createTransferInternal').mockResolvedValue({ success: true });
    vi.spyOn(getTransferenceByIdService, 'getTransferenceById').mockResolvedValue({ success: true, data: { status: 'PENDING' } });
    vi.spyOn(updateTransferenceService, 'updateTransference').mockResolvedValue({ success: true });
    vi.spyOn(updateStockService, 'updateStock').mockResolvedValue({ success: true });
    vi.spyOn(createDeliveriesService, 'createDeliveries').mockResolvedValue({ success: true });
    vi.spyOn(fetchProductsApi, 'fetchProducts').mockResolvedValue([{ id: 1, name: 'Producto' }]);

    const setProducts = vi.fn();
    const setModalInfo = vi.fn();
    const setDetailsCard = vi.fn();

    const { result } = renderHook(() =>
      usePaymentProcess({
        formData: fakeFormData,
        setProducts,
        setModalInfo,
        setDetailsCard,
      }),
    );

    await waitFor(() => result.current.aceptacion === 'tokenAceptacion');

    const btnPagar = document.getElementById('btn-pagar');

    await act(async () => {
      await result.current.handlePayment(fakeProduct, 100);
    });

    expect(btnPagar.disabled).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'setTransactionData' }));
    expect(localStorage.getItem('transaction')).toContain('transf123');
    expect(setProducts).toHaveBeenCalled();
    expect(setModalInfo).toHaveBeenCalledWith(false);
    expect(setDetailsCard).toHaveBeenCalledWith(false);
    expect(toast.success).toHaveBeenCalledWith('✅ Pago realizado exitosamente');
  });

  test('handlePayment maneja error y habilita botón', async () => {
    const fakeFormData = { nombre: 'Juan', direccion: 'Calle falsa 123' };
    const fakeProduct = { id: 1, name: 'Producto', stock: 5 };

    vi.spyOn(accepTokenService, 'accepToken').mockResolvedValue({
      data: {
        presigned_acceptance: { acceptance_token: 'tokenAceptacion' },
        presigned_personal_data_auth: { acceptance_token: 'tokenAutorizacion' },
      },
    });
    vi.spyOn(tokenizacionCardService, 'tokenizacionCard').mockResolvedValue({
      status: 'ERROR',
    });

    const { result } = renderHook(() =>
      usePaymentProcess({
        formData: fakeFormData,
        setProducts: () => {},
        setModalInfo: () => {},
        setDetailsCard: () => {},
      }),
    );

    await waitFor(() => result.current.aceptacion === 'tokenAceptacion');

    const btnPagar = document.getElementById('btn-pagar');

    await act(async () => {
      await result.current.handlePayment(fakeProduct, 100);
    });

    expect(btnPagar.disabled).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('❌ Error en el pago:'));
  });
});
