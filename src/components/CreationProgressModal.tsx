// Modal que muestra el progreso de creación de la empresa
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, ExternalLink, User } from "lucide-react";
import { CreationProgress } from "@/types/company.types";

interface CreationProgressModalProps {
  isOpen: boolean;
  progress: CreationProgress;
  onClose: () => void;
}

export default function CreationProgressModal({ 
  isOpen, 
  progress, 
  onClose 
}: CreationProgressModalProps) {
  // Debug: Log para entender el comportamiento
  console.log('🔍 CreationProgressModal render:', {
    isCompleted: progress.isCompleted,
    stepStatus: progress.steps[0]?.status,
    stepMessage: progress.steps[0]?.message,
    progressPercentage: progress.steps[0]?.progressPercentage,
    hasError: progress.steps.some(step => step.status === 'error')
  });
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getProgressPercentage = () => {
    // Si el proceso está completado, siempre mostrar 100%
    if (progress.isCompleted) {
      return 100;
    }
    
    // Si hay error, mantener el progreso actual sin incrementar
    if (progress.steps.some(step => step.status === 'error')) {
      const currentStep = progress.steps[0];
      return currentStep?.progressPercentage || 0;
    }
    
    // Si hay un progreso específico en el step, usarlo
    const currentStep = progress.steps[0];
    if (currentStep?.progressPercentage !== undefined) {
      return currentStep.progressPercentage;
    }
    
    // Fallback al cálculo original
    const completedSteps = progress.steps.filter(step => step.status === 'completed').length;
    return (completedSteps / progress.steps.length) * 100;
  };

  const getStepTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'in_progress':
        return 'text-blue-700 font-medium';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {progress.steps.some(step => step.status === 'error') ? (
              <>
                <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                Error en el Registro
              </>
            ) : progress.isCompleted ? (
              <>
                <div className="h-8 w-8 rounded-full bg-consware-green flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                Empresa Creada Exitosamente
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-full bg-consware-green flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                Creando tu Empresa
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barra de progreso general */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso general</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
            {!progress.isCompleted && !progress.steps.some(step => step.status === 'error') && (
              <p className="text-xs text-gray-500 text-center mt-2">
                <Clock className="h-3 w-3 inline mr-1" />
                Tiempo estimado: 5 minutos aproximadamente
              </p>
            )}
          </div>

          {/* Lista de pasos */}
          <div className="space-y-4">
            {progress.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${getStepTextColor(step.status)}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </div>
                  {step.message && (
                    <div className="text-xs text-gray-400 mt-1 italic">
                      {step.message}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Resultado final */}
          {progress.isCompleted && progress.finalResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-800 font-medium">
                <CheckCircle className="h-5 w-5" />
                ¡Tu empresa está lista!
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Usuario:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {progress.finalResult.username}
                  </code>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700">
                  <ExternalLink className="h-4 w-4" />
                  <span className="font-medium">Acceso:</span>
                  <a 
                    href={progress.finalResult.accessLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                  >
                    {progress.finalResult.accessLink}
                  </a>
                </div>
              </div>

              <p className="text-sm text-green-700 mt-2">
                {progress.finalResult.message}
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            {progress.isCompleted ? (
              <>
                {progress.finalResult && (
                  <Button
                    onClick={() => window.open(progress.finalResult.accessLink, '_blank')}
                    className="bg-consware-green hover:bg-consware-green-active"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Acceder al Sistema
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Cerrar
                </Button>
              </>
            ) : progress.steps.some(step => step.status === 'error') ? (
              // Si hay algún error, mostrar botón para cerrar
              <>
                <Button variant="outline" onClick={onClose}>
                  Cerrar
                </Button>
              </>
            ) : (
              // Solo mostrar "procesando" si no hay errores y no está completado
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="h-4 w-4 animate-spin" />
                Procesando... Por favor espera
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
