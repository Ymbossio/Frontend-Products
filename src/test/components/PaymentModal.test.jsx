// PaymentModal.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PaymentModal } from '../../components/PaymentModal'
import { Provider} from 'react-redux'
import { store } from '../../redux/store'
import { vi } from 'vitest'
import * as usePaymentFormsModule from '../../hooks/usePaymentForms'


const mockOnClose = vi.fn()
const mockSetDetailsCard = vi.fn()
const mockSetProducts = vi.fn()

// MOCK GLOBAL DEL HOOK - DEFINIDO DIRECTAMENTE EN EL FACTORY
vi.mock('../../hooks/usePaymentForms', () => {
  // Mocks internos para ser configurados después
  const isFormComplete = vi.fn()

  // Exportamos un objeto que retorna la función y su mock para manipulación
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
    __mocks: { isFormComplete } // exportamos el mock para accederlo en tests
  }
})

describe('PaymentModal', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('botón Continuar deshabilitado cuando formulario incompleto', () => {
    // Configuro el mock dentro del test
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

})