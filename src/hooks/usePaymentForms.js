import { useState } from 'react';

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
