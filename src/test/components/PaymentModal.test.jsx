// PaymentModal.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PaymentModal } from '../../components/PaymentModal'
import { Provider } from 'react-redux'
import { store } from '../../redux/store'
import { vi } from 'vitest'
import * as usePaymentFormsModule from '../../hooks/usePaymentForms'
import * as functions from '../../util/functions'

const mockOnClose = vi.fn()
const mockSetDetailsCard = vi.fn()
const mockSetProducts = vi.fn()

// MOCK GLOBAL DEL HOOK - DEFINIDO DIRECTAMENTE EN EL FACTORY
vi.mock('../../hooks/usePaymentForms', () => {
  const isFormComplete = vi.fn()
  return {
    usePaymentForm: () => ({
      formData: {
        nombre: '',
        correo: '',
        numero: '',
        expiracion: '',
        cvv: '',
        ciudad: '',
        direccion: ''
      },
      handleInputChange: vi.fn(),
      isFormComplete: isFormComplete
    }),
    __mocks: { isFormComplete }
  }
})

describe('PaymentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('botón Continuar deshabilitado cuando formulario incompleto', () => {
    usePaymentFormsModule.__mocks.isFormComplete.mockReturnValue(false)

    render(
      <Provider store={store}>
        <PaymentModal
          product={{ name: 'Test Product' }}
          detailsCard={true}
          onClose={mockOnClose}
          setDetailsCard={mockSetDetailsCard}
          setProducts={mockSetProducts}
        />
      </Provider>
    )

    expect(screen.getByText(/Continuar/i)).toBeDisabled()
  })

  test('botón Continuar habilitado cuando formulario completo', () => {
    usePaymentFormsModule.__mocks.isFormComplete.mockReturnValue(true)

    render(
      <Provider store={store}>
        <PaymentModal
          product={{ name: 'Test Product' }}
          detailsCard={true}
          onClose={mockOnClose}
          setDetailsCard={mockSetDetailsCard}
          setProducts={mockSetProducts}
        />
      </Provider>
    )

    expect(screen.getByText(/Continuar/i)).not.toBeDisabled()
  })

  test('no renderiza el modal si no hay producto', () => {
    render(
      <Provider store={store}>
        <PaymentModal
          product={null}
          detailsCard={true}
          onClose={mockOnClose}
          setDetailsCard={mockSetDetailsCard}
          setProducts={mockSetProducts}
        />
      </Provider>
    )

    expect(screen.queryByText(/Pagar/i)).not.toBeInTheDocument()
  })

  test('muestra alerta si tarjeta no es válida', () => {
    usePaymentFormsModule.__mocks.isFormComplete.mockReturnValue(true)
    vi.spyOn(functions, 'validateCard').mockReturnValue(false)
    window.alert = vi.fn()

    render(
      <Provider store={store}>
        <PaymentModal
          product={{ name: 'Test Product' }}
          detailsCard={true}
          onClose={mockOnClose}
          setDetailsCard={mockSetDetailsCard}
          setProducts={mockSetProducts}
        />
      </Provider>
    )

    fireEvent.click(screen.getByText(/Continuar/i))
    expect(window.alert).toHaveBeenCalledWith('⚠️ Tarjeta no válida')
  })

test('abre resumen si la tarjeta es válida', () => {
  usePaymentFormsModule.__mocks.isFormComplete.mockReturnValue(true)
  vi.spyOn(functions, 'validateCard').mockReturnValue(true)

  render(
    <Provider store={store}>
      <PaymentModal
        product={{ name: 'Test Product' }}
        detailsCard={true}
        onClose={mockOnClose}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    </Provider>
  )

  fireEvent.click(screen.getByText(/Continuar/i))
  expect(mockSetDetailsCard).toHaveBeenCalledWith(false)
  expect(screen.getAllByText(/Test Product/i).length).toBeGreaterThan(0)
})


  test('cierra el modal al hacer clic en Cancelar', () => {
    render(
      <Provider store={store}>
        <PaymentModal
          product={{ name: 'Test Product' }}
          detailsCard={true}
          onClose={mockOnClose}
          setDetailsCard={mockSetDetailsCard}
          setProducts={mockSetProducts}
        />
      </Provider>
    )

    fireEvent.click(screen.getByText(/Cancelar/i))
    expect(mockOnClose).toHaveBeenCalled()
  })

test('muestra el logo de Visa si el número de tarjeta comienza con 4', () => {
  usePaymentFormsModule.__mocks.isFormComplete.mockReturnValue(true)

  vi.spyOn(usePaymentFormsModule, 'usePaymentForm').mockReturnValue({
    formData: {
      nombre: '',
      correo: '',
      numero: '4111111111111111',
      expiracion: '',
      cvv: '',
      ciudad: '',
      direccion: ''
    },
    handleInputChange: vi.fn(),
    isFormComplete: () => true
  })

  render(
    <Provider store={store}>
      <PaymentModal
        product={{ name: 'Test Product' }}
        detailsCard={true}
        onClose={mockOnClose}
        setDetailsCard={mockSetDetailsCard}
        setProducts={mockSetProducts}
      />
    </Provider>
  )

  expect(screen.getByAltText(/Visa/i)).toBeInTheDocument()
})

})
