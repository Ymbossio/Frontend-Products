import { createSlice } from '@reduxjs/toolkit';

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

const paymentFormSlice = createSlice({
  name: 'paymentForm',
  initialState,
  reducers: {
    setFormData(state, action) {
      return { ...state, ...action.payload };
    },
    resetForm() {
      return initialState;
    }
  }
});

export const { setFormData, resetForm } = paymentFormSlice.actions;
export default paymentFormSlice.reducer;
