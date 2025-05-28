import reducer, { setFormData, resetForm } from '../../redux/FormCardSlice';

describe('paymentFormSlice', () => {
  const initialState = {
    nombre: '',
    correo: '',
    numero: '',
    expiracion: '',
    cvv: '',
    ciudad: '',
    direccion: '',
    aceptaTerminos: false,
    autorizaDatos: false,
  };

  it('debería retornar el estado inicial', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('debería manejar setFormData', () => {
    const payload = {
      nombre: 'Juan',
      correo: 'juan@test.com',
      aceptaTerminos: true,
    };

    const updatedState = reducer(initialState, setFormData(payload));

    expect(updatedState).toEqual({
      ...initialState,
      nombre: 'Juan',
      correo: 'juan@test.com',
      aceptaTerminos: true,
    });
  });

  it('debería manejar resetForm', () => {
    const currentState = {
      nombre: 'Ana',
      correo: 'ana@test.com',
      numero: '1234',
      expiracion: '12/25',
      cvv: '123',
      ciudad: 'Bogotá',
      direccion: 'Calle Falsa 123',
      aceptaTerminos: true,
      autorizaDatos: true,
    };

    const resetState = reducer(currentState, resetForm());

    expect(resetState).toEqual(initialState);
  });
});
