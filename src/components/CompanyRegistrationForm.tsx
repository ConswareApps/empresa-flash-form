import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CompanyInfoStep from "./form-steps/CompanyInfoStep";
import LegalRepresentativeStep from "./form-steps/LegalRepresentativeStep";
import MasterUserStep from "./form-steps/MasterUserStep";
import ReviewStep from "./form-steps/ReviewStep";

export interface CompanyFormData {
  identificacion: string;
  nombreEmpresa: string;
  digitoVerificador: number;
  celular: string;
  direccion: string;
  barrio: string;
  codigoPostal: string;
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

const INITIAL_FORM_DATA: CompanyFormData = {
  identificacion: "",
  nombreEmpresa: "",
  digitoVerificador: 0,
  celular: "",
  direccion: "",
  barrio: "",
  codigoPostal: "",
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

const STEPS = [
  { title: "Información de la Empresa", description: "Datos básicos de la empresa" },
  { title: "Representante Legal", description: "Información del representante legal" },
  { title: "Usuario Master", description: "Configuración del usuario administrador" },
  { title: "Revisión", description: "Confirma los datos antes de enviar" },
];

export default function CompanyRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CompanyFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = (newData: Partial<CompanyFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const generateUsername = (nombreCompleto: string): string => {
    const cleanName = nombreCompleto.replace(/\s+/g, '').toUpperCase();
    return `MASTER${cleanName}`;
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://talenton8n.talent-o.co/webhook-test/empresa-registro-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "¡Registro exitoso!",
          description: "La empresa ha sido registrada correctamente.",
          variant: "default",
        });
        
        // Reset form
        setFormData(INITIAL_FORM_DATA);
        setCurrentStep(0);
      } else {
        throw new Error('Error en el servidor');
      }
    } catch (error) {
      toast({
        title: "Error al registrar",
        description: "Hubo un problema al registrar la empresa. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const renderStep = () => {
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
    <div className="min-h-screen bg-consware-bg-gray flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-h1 font-bold text-consware-dark mb-2">
            Registro de Empresa
          </h1>
          <p className="text-base text-consware-gray-primary">
            Complete los siguientes pasos para registrar su empresa
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index <= currentStep ? 'text-primary' : 'text-consware-gray-primary'
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-semibold mb-2 ${
                    index <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-consware-gray-medium text-consware-gray-primary'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="text-xs font-medium hidden sm:block">{step.title}</div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="shadow-lg border-consware-gray-border">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-h2 font-semibold text-consware-dark mb-2">
                {STEPS[currentStep].title}
              </h2>
              <p className="text-sm text-consware-gray-primary">
                {STEPS[currentStep].description}
              </p>
            </div>

            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}