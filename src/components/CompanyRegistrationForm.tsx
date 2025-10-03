// Componente principal del formulario de registro de empresa - Solo UI
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useCompanyForm } from "@/hooks/useCompanyForm";
import CompanyInfoStep from "./form-steps/CompanyInfoStep";
import LegalRepresentativeStep from "./form-steps/LegalRepresentativeStep";
import MasterUserStep from "./form-steps/MasterUserStep";
import ReviewStep from "./form-steps/ReviewStep";
import CreationProgressModal from "./CreationProgressModal";
import EnvironmentSelector from "./EnvironmentSelector";

export default function CompanyRegistrationForm() {
  const {
    currentStep,
    formData,
    isSubmitting,
    steps,
    progress,
    isLastStep,
    isFirstStep,
    nextStep,
    prevStep,
    updateFormData,
    generateUsername,
    submitForm,
    creationProgress,
    showProgressModal,
    closeProgressModal,
  } = useCompanyForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CompanyInfoStep
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 1:
        return (
          <LegalRepresentativeStep
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <MasterUserStep
            data={formData}
            updateData={updateFormData}
            generateUsername={generateUsername}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ReviewStep
            data={formData}
            onSubmit={submitForm}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-consware-bg-gray to-consware-bg-content p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-consware-green">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-consware-dark">
            Registro de Empresa
          </h1>
          <p className="text-consware-gray-primary">
            Complete la información para registrar su empresa en el sistema
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-4 flex justify-between text-sm text-consware-gray-primary">
            <span>Paso {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="mt-4 flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center ${
                  index <= currentStep
                    ? "text-consware-green"
                    : "text-consware-gray-secondary"
                }`}
              >
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                    index <= currentStep
                      ? "border-consware-green bg-consware-green text-white"
                      : "border-consware-gray-secondary bg-white"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="max-w-20 text-xs">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Environment Selector - Esquina superior derecha */}
            <div className="flex justify-end mb-4">
              <EnvironmentSelector />
            </div>
            
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Modal de progreso de creación */}
        {creationProgress && (
          <CreationProgressModal
            isOpen={showProgressModal}
            progress={creationProgress}
            onClose={closeProgressModal}
          />
        )}
      </div>
    </div>
  );
}