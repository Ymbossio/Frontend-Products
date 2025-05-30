import { renderHook, act } from '@testing-library/react';
import { usePaymentForm } from '../../hooks/usePaymentForms';
import { useSelector, useDispatch } from 'react-redux';
import { setFormData } from '../../redux/FormCardSlice';
import { vi } from 'vitest';

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}));

vi.mock('../../redux/FormCardSlice', () => ({
  setFormData: vi.fn((payload) => ({ type: 'setFormData', payload })),
}));

describe('usePaymentForm', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
  });

  test('retorna formData desde el selector', () => {
    const mockFormData = { nombre: 'Juan', numero: '1234' };
    useSelector.mockImplementation((selector) => selector({ paymentForm: mockFormData }));

    const { result } = renderHook(() => usePaymentForm());

    expect(result.current.formData).toEqual(mockFormData);
  });
  

  test('handleInputChange despacha setFormData con valor correcto para input', () => {
    useSelector.mockImplementation((selector) => selector({ paymentForm: {} }));

    const { result } = renderHook(() => usePaymentForm());

    const event = {
      target: { name: 'nombre', value: 'Pedro', type: 'text' },
    };

    act(() => {
      result.current.handleInputChange(event);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setFormData({ nombre: 'Pedro' }));
  });

  test('handleInputChange despacha setFormData con valor correcto para checkbox', () => {
    useSelector.mockImplementation((selector) => selector({ paymentForm: {} }));

    const { result } = renderHook(() => usePaymentForm());

    const event = {
      target: { name: 'aceptaTerminos', checked: true, type: 'checkbox' },
    };

    act(() => {
      result.current.handleInputChange(event);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setFormData({ aceptaTerminos: true }));
  });

  test('isFormComplete retorna true si todos los campos requeridos tienen valor no vacío', () => {
    const mockFormData = {
      nombre: 'Ana',
      numero: '1234567890123456',
      correo: 'ana@example.com',
      expiracion: '12/25',
      cvv: '123',
    };

    useSelector.mockImplementation((selector) => selector({ paymentForm: mockFormData }));

    const { result } = renderHook(() => usePaymentForm());

    expect(result.current.isFormComplete()).toBe(true);
  });

  test('isFormComplete retorna false si algún campo requerido está vacío', () => {
    const mockFormData = {
      nombre: 'Ana',
      numero: '',
      correo: 'ana@example.com',
      expiracion: '12/25',
      cvv: '123',
    };

    useSelector.mockImplementation((selector) => selector({ paymentForm: mockFormData }));

    const { result } = renderHook(() => usePaymentForm());

    expect(result.current.isFormComplete()).toBe(false);
  });
  
});
