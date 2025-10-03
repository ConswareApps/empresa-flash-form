// Utilidades de validación para formularios
import { CompanyFormData, ValidationErrors } from '@/types/company.types';
import { FORM_CONSTRAINTS } from '@/constants/company.constants';

export class ValidationUtils {
  /**
   * Valida los datos de información de empresa
   */
  static validateCompanyInfo(data: CompanyFormData): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!data.identificacion.trim()) {
      errors.identificacion = "La identificación es requerida";
    }
    
    if (!data.nombreEmpresa.trim()) {
      errors.nombreEmpresa = "El nombre de la empresa es requerido";
    }
    
    if (!data.digitoVerificador || data.digitoVerificador < FORM_CONSTRAINTS.DIGIT_VERIFIER_MIN || data.digitoVerificador > FORM_CONSTRAINTS.DIGIT_VERIFIER_MAX) {
      errors.digitoVerificador = `El dígito verificador debe ser entre ${FORM_CONSTRAINTS.DIGIT_VERIFIER_MIN} y ${FORM_CONSTRAINTS.DIGIT_VERIFIER_MAX}`;
    }
    
    if (!data.celular.trim()) {
      errors.celular = "El celular es requerido";
    } else if (data.celular.length !== FORM_CONSTRAINTS.PHONE_LENGTH) {
      errors.celular = `El celular debe tener exactamente ${FORM_CONSTRAINTS.PHONE_LENGTH} dígitos`;
    }

    if (!data.pais.trim()) {
      errors.pais = "El país es requerido";
    }

    return errors;
  }

  /**
   * Valida los datos del representante legal
   */
  static validateLegalRepresentative(data: CompanyFormData): ValidationErrors {
    const errors: ValidationErrors = {};
    const rep = data.representanteLegal;

    if (!rep.identificacion.trim()) {
      errors.identificacion = "La identificación es requerida";
    }
    
    if (!rep.nombreCompleto.trim()) {
      errors.nombreCompleto = "El nombre completo es requerido";
    }
    
    if (!rep.celular.trim()) {
      errors.celular = "El celular es requerido";
    } else if (rep.celular.length !== FORM_CONSTRAINTS.PHONE_LENGTH) {
      errors.celular = `El celular debe tener exactamente ${FORM_CONSTRAINTS.PHONE_LENGTH} dígitos`;
    }
    
    if (!rep.correoElectronico.trim()) {
      errors.correoElectronico = "El correo electrónico es requerido";
    } else if (!this.isValidEmail(rep.correoElectronico)) {
      errors.correoElectronico = "El correo electrónico no es válido";
    }

    return errors;
  }

  /**
   * Valida los datos del usuario master
   */
  static validateMasterUser(data: CompanyFormData): ValidationErrors {
    const errors: ValidationErrors = {};
    const user = data.usuarioMaster;

    if (!user.nombreCompleto.trim()) {
      errors.nombreCompleto = "El nombre completo es requerido";
    }
    
    if (!user.identificacion.trim()) {
      errors.identificacion = "La identificación es requerida";
    }
    
    if (!user.correo.trim()) {
      errors.correo = "El correo electrónico es requerido";
    } else if (!this.isValidEmail(user.correo)) {
      errors.correo = "El correo electrónico no es válido";
    }

    // El celular es opcional para el usuario master

    return errors;
  }

  /**
   * Valida si un email tiene formato correcto
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verifica si hay errores en el objeto de validación
   */
  static hasErrors(errors: ValidationErrors): boolean {
    return Object.keys(errors).length > 0;
  }
}
