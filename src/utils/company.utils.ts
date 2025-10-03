// Utilidades específicas para el dominio de empresas
import { CompanyFormData } from '@/types/company.types';

export class CompanyUtils {
  /**
   * Genera un username basado en el nombre de la empresa
   */
  static generateUsername(nombreEmpresa: string): string {
    const cleanName = nombreEmpresa.replace(/\s+/g, '').toUpperCase();
    return `MASTER${cleanName}`;
  }

  /**
   * Genera el nombre de empresa sin espacios
   */
  static generateCompanyNameWithoutSpaces(nombreEmpresa: string): string {
    return nombreEmpresa.replace(/\s+/g, '').toUpperCase();
  }

  /**
   * Crea los datos iniciales del formulario
   */
  static createInitialFormData(): CompanyFormData {
    return {
      identificacion: "",
      nombreEmpresa: "",
      nombreEmpresaSinEspacios: "",
      digitoVerificador: 0,
      celular: "",
      pais: "",
      representanteLegal: {
        identificacion: "",
        nombreCompleto: "",
        celular: "",
        correoElectronico: "",
      },
      usuarioMaster: {
        nombreCompleto: "",
        identificacion: "",
        celular: "",
        correo: "",
        username: "",
      },
    };
  }

  /**
   * Resetea el formulario a su estado inicial
   */
  static resetFormData(): CompanyFormData {
    return this.createInitialFormData();
  }

  /**
   * Actualiza los datos del formulario de manera inmutable
   */
  static updateFormData(
    currentData: CompanyFormData, 
    updates: Partial<CompanyFormData>
  ): CompanyFormData {
    return { ...currentData, ...updates };
  }
}
