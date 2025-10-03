// Configuración de entornos para los servicios
export type Environment = 'QA' | 'PRD';

export interface EnvironmentConfig {
  apiUrl: string;
  name: string;
  description: string;
}

export const ENVIRONMENT_CONFIGS: Record<Environment, EnvironmentConfig> = {
  QA: {
    apiUrl: 'https://consware.app.n8n.cloud/webhook/regitrarQA',
    name: 'QA',
    description: 'Ambiente de Pruebas'
  },
  PRD: {
    apiUrl: 'https://consware.app.n8n.cloud/webhook/registrarPRD', // Cambiar por la URL real de PRD
    name: 'PRD',
    description: 'Ambiente de Producción'
  }
};

export class EnvironmentManager {
  private static currentEnvironment: Environment | null = null; // Sin entorno por defecto

  /**
   * Obtiene el entorno actual
   */
  static getCurrentEnvironment(): Environment | null {
    return this.currentEnvironment;
  }

  /**
   * Establece el entorno actual
   */
  static setEnvironment(environment: Environment): void {
    this.currentEnvironment = environment;
    console.log(`🔄 Entorno cambiado a: ${ENVIRONMENT_CONFIGS[environment].name} (${ENVIRONMENT_CONFIGS[environment].description})`);
  }

  /**
   * Obtiene la configuración del entorno actual
   */
  static getCurrentConfig(): EnvironmentConfig | null {
    return this.currentEnvironment ? ENVIRONMENT_CONFIGS[this.currentEnvironment] : null;
  }

  /**
   * Obtiene la URL del API del entorno actual
   */
  static getCurrentApiUrl(): string | null {
    const config = this.getCurrentConfig();
    return config ? config.apiUrl : null;
  }

  /**
   * Obtiene todos los entornos disponibles
   */
  static getAvailableEnvironments(): Array<{ key: Environment; config: EnvironmentConfig }> {
    return Object.entries(ENVIRONMENT_CONFIGS).map(([key, config]) => ({
      key: key as Environment,
      config
    }));
  }

  /**
   * Verifica si estamos en producción
   */
  static isProduction(): boolean {
    return this.currentEnvironment === 'PRD';
  }

  /**
   * Verifica si estamos en QA
   */
  static isQA(): boolean {
    return this.currentEnvironment === 'QA';
  }

  /**
   * Verifica si hay un entorno seleccionado
   */
  static hasEnvironmentSelected(): boolean {
    return this.currentEnvironment !== null;
  }
}
