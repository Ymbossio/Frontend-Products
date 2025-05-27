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
    return requiredFields.every(field => formData[field]?.trim() !== '');
  };

  return { formData, handleInputChange, isFormComplete };
}





/* import { useState } from 'react';

export function usePaymentForm(initialValues) {
  const [formData, setFormData] = useState(initialValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormComplete = () => {
    const requiredFields = ['nombre', 'numero', 'correo', 'expiracion', 'cvv'];
    return requiredFields.every(field => formData[field].trim() !== '');
  };

  return { formData, setFormData, handleInputChange, isFormComplete };
}
 */