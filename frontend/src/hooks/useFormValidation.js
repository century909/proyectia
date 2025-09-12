import { useState, useCallback } from 'react';

export function useFormValidation(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  }, [validationRules, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name] || '');
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues,
    setErrors
  };
}

// Common validation rules
export const validationRules = {
  required: (message = 'Este campo es requerido') => (value) => 
    !value || value.trim() === '' ? message : '',

  email: (message = 'Ingresa un email válido') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? message : '';
  },

  minLength: (min, message) => (value) => 
    value && value.length < min ? message || `Mínimo ${min} caracteres` : '',

  maxLength: (max, message) => (value) => 
    value && value.length > max ? message || `Máximo ${max} caracteres` : '',

  password: (message = 'La contraseña debe tener al menos 8 caracteres') => (value) => 
    value && value.length < 8 ? message : '',

  confirmPassword: (message = 'Las contraseñas no coinciden') => (value, allValues) => 
    value && value !== allValues.password ? message : '',
};

