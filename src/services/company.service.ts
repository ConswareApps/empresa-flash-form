// Servicio para operaciones relacionadas con empresas
import { CompanyFormData, ApiResponse, CreationProgress, CreationStep } from '@/types/company.types';
import { EnvironmentManager } from '@/config/environment.config';

export class CompanyService {
  /**
   * Obtiene la URL del API según el entorno actual
   */
  private static getApiEndpoint(): string {
    const apiUrl = EnvironmentManager.getCurrentApiUrl();
    if (!apiUrl) {
      throw new Error('Debe seleccionar un entorno antes de continuar');
    }
    return apiUrl;
  }

  /**
   * Crea el progreso inicial para el proceso de creación
   */
  private static createInitialProgress(companyData: CompanyFormData): CreationProgress {
    return {
      currentStep: 0,
      isCompleted: false,
      steps: [
        {
          id: 1,
          title: 'Procesando Solicitud',
          description: 'Este proceso puede tomar varios minutos...',
          status: 'pending'
        }
      ]
    };
  }

  /**
   * Simula el delay entre pasos del proceso
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Genera un link de acceso por defecto según el ambiente seleccionado
   */
  private static generateAccessLink(companyData: CompanyFormData): string {
    const currentEnvironment = EnvironmentManager.getCurrentEnvironment();
    
    // Enlaces específicos según el ambiente
    if (currentEnvironment === 'QA') {
      return 'https://pruebapp.gasup.com.co/front/#/auth';
    } else if (currentEnvironment === 'PRD') {
      return 'https://app.gasup.com.co/front/#/auth';
    }
    
    // Fallback al enlace original si no hay ambiente seleccionado
    const cleanName = companyData.nombreEmpresaSinEspacios.toLowerCase();
    return `https://${cleanName}.consware.com.co`;
  }

  /**
   * Genera username por defecto solo como fallback
   * (normalmente se usa el username del formulario)
   */
  private static generateUsername(companyData: CompanyFormData): string {
    return `MASTER${companyData.nombreEmpresaSinEspacios}`;
  }

  /**
   * Inicia los mensajes de progreso rotativo con barra de progreso temporal
   */
  private static startProgressMessages(
    progress: CreationProgress,
    onProgressUpdate: (progress: CreationProgress) => void
  ): { 
    messageInterval: NodeJS.Timeout; 
    progressInterval: NodeJS.Timeout;
    cleanup: () => void;
  } {
    const messages = [
      'Iniciando proceso de creación...',
      'Registrando empresa en el sistema...',
      'Configurando usuario master...',
      'Creando base de datos dedicada...',
      'Aplicando configuraciones del tenant...',
      'Finalizando configuración...',
      'Proceso en curso, por favor espera...'
    ];

    let messageIndex = 0;
    let progressPercentage = 0;
    let isCleanedUp = false;
    
    // Mostrar primer mensaje inmediatamente
    progress.steps[0].status = 'in_progress';
    progress.steps[0].message = messages[messageIndex];
    progress.steps[0].progressPercentage = progressPercentage;
    onProgressUpdate({ ...progress });
    messageIndex++;

    // Cambiar mensaje cada 45 segundos (5 minutos / 7 mensajes ≈ 43s)
    const messageInterval = setInterval(() => {
      if (isCleanedUp) return; // No actualizar si ya se limpió
      
      if (messageIndex < messages.length) {
        progress.steps[0].message = messages[messageIndex];
        onProgressUpdate({ ...progress });
        messageIndex++;
      } else {
        // Reiniciar desde el último mensaje
        progress.steps[0].message = messages[messages.length - 1];
        onProgressUpdate({ ...progress });
      }
    }, 45000);

    // Incrementar barra de progreso cada 3 segundos (5 minutos = 300s / 100% = 3s por 1%)
    const progressInterval = setInterval(() => {
      if (isCleanedUp) return; // No actualizar si ya se limpió
      
      if (progressPercentage < 95) { // No llegar al 100% hasta que termine realmente
        progressPercentage += 1;
        progress.steps[0].progressPercentage = progressPercentage;
        onProgressUpdate({ ...progress });
      }
    }, 3000);

    // Función de limpieza
    const cleanup = () => {
      isCleanedUp = true;
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };

    return { messageInterval, progressInterval, cleanup };
  }

  /**
   * Registra una nueva empresa con progreso en tiempo real
   * @param companyData - Datos de la empresa a registrar
   * @param onProgressUpdate - Callback para actualizar el progreso
   * @returns Promise con el resultado final
   */
  static async registerCompanyWithProgress(
    companyData: CompanyFormData,
    onProgressUpdate: (progress: CreationProgress) => void
  ): Promise<{
    success: boolean;
    message: string;
    progress: CreationProgress;
  }> {
    const progress = this.createInitialProgress(companyData);
    
    let progressIntervals: { cleanup: () => void } | null = null;
    
    try {
      // Iniciar mensajes de progreso rotativo y barra de progreso temporal
      progressIntervals = this.startProgressMessages(progress, onProgressUpdate);

      // Enviar solicitud al API y esperar la respuesta final
      const apiEndpoint = this.getApiEndpoint();
      const currentEnv = EnvironmentManager.getCurrentEnvironment();
      console.log(`🌐 Enviando solicitud a: ${apiEndpoint} (${currentEnv})`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const responseData = await response.json();
      
      // Detener mensajes de progreso y barra temporal INMEDIATAMENTE
      progressIntervals.cleanup();
      
      // Verificar si hay error en la respuesta
      const hasError = this.hasResponseError(responseData);
      
      if (hasError) {
        progress.steps[0].status = 'error';
        progress.steps[0].message = this.extractErrorMessage(responseData);
        onProgressUpdate({ ...progress });
        
        return {
          success: false,
          message: progress.steps[0].message,
          progress
        };
      }

      // Proceso completado exitosamente
      progress.steps[0].status = 'completed';
      progress.steps[0].message = 'Empresa creada exitosamente';
      progress.steps[0].progressPercentage = 100;
      progress.isCompleted = true;
      
      // Configurar resultado final
      progress.finalResult = {
        accessLink: responseData.data?.accessLink || this.generateAccessLink(companyData),
        username: responseData.data?.username || companyData.usuarioMaster.username,
        message: responseData.data?.message || `¡Bienvenido! Tu empresa "${companyData.nombreEmpresa}" está lista para usar.`
      };

      onProgressUpdate({ ...progress });

      return {
        success: true,
        message: 'Empresa creada exitosamente',
        progress
      };

    } catch (error) {
      console.error('Error en el proceso de creación:', error);
      
      // IMPORTANTE: Limpiar intervalos en caso de error
      if (progressIntervals) {
        progressIntervals.cleanup();
      }
      
      // Marcar el paso actual como error
      progress.steps[0].status = 'error';
      
      // Determinar el mensaje de error apropiado
      if (error instanceof TypeError && error.message.includes('fetch')) {
        progress.steps[0].message = 'Error de conexión con el servidor';
      } else if (error instanceof Error) {
        progress.steps[0].message = error.message;
      } else {
        progress.steps[0].message = 'Error inesperado en el proceso';
      }
      
      onProgressUpdate({ ...progress });
      
      return {
        success: false,
        message: progress.steps[0].message,
        progress
      };
    }
  }

  /**
   * Método original mantenido para compatibilidad
   * @param companyData - Datos de la empresa a registrar
   * @returns Promise con la respuesta del servidor
   */
  static async registerCompany(companyData: CompanyFormData): Promise<{
    success: boolean;
    message: string;
    data?: unknown;
  }> {
    try {
      const apiEndpoint = this.getApiEndpoint();
      const currentEnv = EnvironmentManager.getCurrentEnvironment();
      console.log(`🌐 Enviando solicitud a: ${apiEndpoint} (${currentEnv})`);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const responseData = await response.json();
      
      // Verificar si hay errores en el contenido de la respuesta
      const hasError = this.hasResponseError(responseData);
      
      // Solo considerar exitoso si no hay errores Y la respuesta indica éxito explícito
      const isSuccess = response.ok && !hasError && this.isSuccessResponse(responseData);
      
      if (isSuccess) {
        return {
          success: true,
          message: 'Empresa registrada correctamente',
          data: responseData
        };
      } else {
        const errorMessage = this.extractErrorMessage(responseData);
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Error al registrar empresa:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intenta nuevamente.'
      };
    }
  }

  /**
   * Verifica si la respuesta contiene errores
   */
  private static hasResponseError(responseData: unknown): boolean {
    if (!responseData) return false;
    
    const data = responseData as Record<string, unknown>;
    
    return (
      Boolean(data.error) || 
      (Array.isArray(responseData) && responseData.length > 0 && Boolean((responseData[0] as Record<string, unknown>).error)) ||
      // Detectar mensajes de error del negocio
      (typeof responseData === 'string' && responseData.includes('ya se encuentra')) ||
      (data.message && typeof data.message === 'string' && (
        data.message.includes('ya se encuentra') ||
        data.message.includes('duplicado') ||
        data.message.includes('existe')
      ))
    );
  }

  /**
   * Verifica si la respuesta indica éxito
   */
  private static isSuccessResponse(responseData: unknown): boolean {
    if (!responseData) return false;
    
    const data = responseData as Record<string, unknown>;
    
    return (
      data.success === true ||
      data.status === 'success' ||
      (typeof responseData === 'object' && !data.error && !data.message) ||
      (Array.isArray(responseData) && responseData.length === 0) // Array vacío puede indicar éxito
    );
  }

  /**
   * Extrae el mensaje de error de la respuesta
   */
  private static extractErrorMessage(responseData: unknown): string {
    if (typeof responseData === 'string') {
      return responseData;
    }
    
    if (!responseData || typeof responseData !== 'object') {
      return 'Error desconocido al procesar la solicitud';
    }
    
    const data = responseData as Record<string, unknown>;
    
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
    
    if (data.message && typeof data.message === 'string') {
      return data.message;
    }
    
    if (Array.isArray(responseData) && responseData.length > 0) {
      const firstItem = responseData[0] as Record<string, unknown>;
      if (firstItem.error && typeof firstItem.error === 'string') {
        return firstItem.error;
      }
    }
    
    return 'Error desconocido al procesar la solicitud';
  }
}
