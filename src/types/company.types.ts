// Tipos e interfaces para el dominio de empresas
export interface CompanyFormData {
  identificacion: string;
  nombreEmpresa: string;
  nombreEmpresaSinEspacios: string;
  digitoVerificador: number;
  celular: string;
  pais: string;
  representanteLegal: {
    identificacion: string;
    nombreCompleto: string;
    celular: string;
    correoElectronico: string;
  };
  usuarioMaster: {
    nombreCompleto: string;
    identificacion: string;
    celular: string;
    correo: string;
    username: string;
  };
}

export interface FormStep {
  title: string;
  description: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface ApiResponse {
  success?: boolean;
  status?: string;
  error?: string;
  message?: string;
}

export interface Country {
  label: string;
  value: string;
}

export interface CreationStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  message?: string;
  progressPercentage?: number;
}

export interface CreationProgress {
  currentStep: number;
  steps: CreationStep[];
  isCompleted: boolean;
  finalResult?: {
    accessLink: string;
    username: string;
    message: string;
  };
}
