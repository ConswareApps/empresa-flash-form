// Hook para manejar validaciones en tiempo real
import { useState, useCallback } from 'react';
import { CompanyFormData, ValidationErrors } from '@/types/company.types';
import { ValidationUtils } from '@/utils/validation.utils';

export const useFormValidation = (formData: CompanyFormData) => {
  const [errors, setErrors] = useState<Record<string, ValidationErrors>>({
    company: {},
    legal: {},
    user: {},
  });

  // Validar paso específico
  const validateStep = useCallback((step: number): boolean => {
    let stepErrors: ValidationErrors = {};
    let stepKey = '';

    switch (step) {
      case 0:
        stepErrors = ValidationUtils.validateCompanyInfo(formData);
        stepKey = 'company';
        break;
      case 1:
        stepErrors = ValidationUtils.validateLegalRepresentative(formData);
        stepKey = 'legal';
        break;
      case 2:
        stepErrors = ValidationUtils.validateMasterUser(formData);
        stepKey = 'user';
        break;
    }

    setErrors(prev => ({
      ...prev,
      [stepKey]: stepErrors
    }));

    return !ValidationUtils.hasErrors(stepErrors);
  }, [formData]);

  // Limpiar errores de un campo específico
  const clearFieldError = useCallback((step: number, field: string) => {
    const stepKey = step === 0 ? 'company' : step === 1 ? 'legal' : 'user';
    
    setErrors(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: ''
      }
    }));
  }, []);

  // Obtener errores de un paso específico
  const getStepErrors = useCallback((step: number): ValidationErrors => {
    const stepKey = step === 0 ? 'company' : step === 1 ? 'legal' : 'user';
    return errors[stepKey] || {};
  }, [errors]);

  return {
    errors,
    validateStep,
    clearFieldError,
    getStepErrors,
  };
};
