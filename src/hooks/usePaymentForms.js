import { useSelector, useDispatch } from 'react-redux';
import { setFormData } from '../redux/FormCardSlice';

export function usePaymentForm() {
  const formData = useSelector(state => state.paymentForm);

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    dispatch(setFormData({ [name]: val }));
  };

  const isFormComplete = () => {
  const requiredFields = ['nombre', 'numero', 'correo', 'expiracion', 'cvv'];
  return requiredFields.every(field => {
    const value = formData[field];
    return typeof value === 'string' && value.trim() !== '';
  });
};


  return { formData, handleInputChange, isFormComplete };
}