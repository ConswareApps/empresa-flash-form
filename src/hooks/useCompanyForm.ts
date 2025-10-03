// Hook personalizado para la lógica del formulario de empresa
import { useState, useCallback } from 'react';
import { CompanyFormData, FormStep, CreationProgress } from '@/types/company.types';
import { CompanyService } from '@/services/company.service';
import { CompanyUtils } from '@/utils/company.utils';
import { useToast } from '@/hooks/use-toast';
import { EnvironmentManager } from '@/config/environment.config';

const STEPS: FormStep[] = [
  { title: "Empresa", description: "Datos básicos" },
  { title: "Representante", description: "Información legal" },
  { title: "Usuario", description: "Administrador" },
  { title: "Revisión", description: "Confirmar datos" },
];

export const useCompanyForm = () => {
  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CompanyFormData>(() => 
    CompanyUtils.createInitialFormData()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [creationProgress, setCreationProgress] = useState<CreationProgress | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  
  const { toast } = useToast();

  // Navegación entre pasos
  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  // Actualización de datos
  const updateFormData = useCallback((newData: Partial<CompanyFormData>) => {
    setFormData(prev => CompanyUtils.updateFormData(prev, newData));
  }, []);

  // Generación de username
  const generateUsername = useCallback((nombreEmpresa: string): string => {
    return CompanyUtils.generateUsername(nombreEmpresa);
  }, []);

  // Callback para actualizar el progreso
  const handleProgressUpdate = useCallback((progress: CreationProgress) => {
    setCreationProgress(progress);
  }, []);

  // Cerrar modal de progreso
  const closeProgressModal = useCallback(() => {
    setShowProgressModal(false);
    setCreationProgress(null);
    
    // Reset form solo si el proceso fue exitoso
    if (creationProgress?.isCompleted) {
      setFormData(CompanyUtils.resetFormData());
      setCurrentStep(0);
    }
  }, [creationProgress]);

  // Envío del formulario con progreso
  const submitForm = useCallback(async () => {
    // Validar que se haya seleccionado un entorno
    if (!EnvironmentManager.hasEnvironmentSelected()) {
      toast({
        title: "Entorno requerido",
        description: "Debe seleccionar un entorno (QA o PRD) antes de continuar",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setShowProgressModal(true);
    
    try {
      const result = await CompanyService.registerCompanyWithProgress(
        formData, 
        handleProgressUpdate
      );
      
      if (!result.success && !result.progress.isCompleted) {
        // Solo mostrar toast de error si no se completó el proceso
        toast({
          title: "Error en el registro",
          description: result.message,
          variant: "destructive",
        });
      }
      
      return { success: result.success, message: result.message };
    } catch (error) {
      const errorMessage = "Error inesperado. Por favor, intenta nuevamente.";
      
      toast({
        title: "Error inesperado",
        description: errorMessage,
        variant: "destructive",
      });
      
      setShowProgressModal(false);
      return { success: false, message: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, handleProgressUpdate, toast]);

  // Reset del formulario
  const resetForm = useCallback(() => {
    setFormData(CompanyUtils.resetFormData());
    setCurrentStep(0);
    setIsSubmitting(false);
  }, []);

  // Cálculo del progreso
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  // Verificar si es el último paso
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return {
    // Estados
    currentStep,
    formData,
    isSubmitting,
    steps: STEPS,
    progress,
    isLastStep,
    isFirstStep,
    
    // Estados de progreso
    creationProgress,
    showProgressModal,
    
    // Acciones
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    generateUsername,
    submitForm,
    resetForm,
    closeProgressModal,
  };
};
