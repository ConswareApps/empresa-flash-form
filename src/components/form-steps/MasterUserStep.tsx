import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface MasterUserStepProps {
  data: CompanyFormData;
  updateData: (data: Partial<CompanyFormData>) => void;
  generateUsername: (nombreCompleto: string) => string;
  onNext: () => void;
  onPrev: () => void;
}

export default function MasterUserStep({ 
  data, 
  updateData, 
  generateUsername,
  onNext, 
  onPrev 
}: MasterUserStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate username when name changes
  useEffect(() => {
    if (data.usuarioMaster.nombreCompleto) {
      const newUsername = generateUsername(data.usuarioMaster.nombreCompleto);
      updateData({
        usuarioMaster: {
          ...data.usuarioMaster,
          username: newUsername
        }
      });
    }
  }, [data.usuarioMaster.nombreCompleto, generateUsername, updateData]);

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.usuarioMaster.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es requerido";
    }
    if (!data.usuarioMaster.identificacion.trim()) {
      newErrors.identificacion = "La identificación es requerida";
    }
    if (!data.usuarioMaster.celular.trim()) {
      newErrors.celular = "El celular es requerido";
    }
    if (!data.usuarioMaster.correo.trim()) {
      newErrors.correo = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.usuarioMaster.correo)) {
      newErrors.correo = "El correo electrónico no es válido";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    updateData({
      usuarioMaster: {
        ...data.usuarioMaster,
        [field]: value
      }
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-consware-bg-content rounded-lg p-4 border-l-4 border-primary">
        <div className="flex items-center mb-2">
          <User className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-sm font-semibold text-consware-dark">Usuario Master</h3>
        </div>
        <p className="text-xs text-consware-gray-primary">
          El usuario master tendrá acceso completo al sistema y podrá administrar toda la empresa.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="master-nombreCompleto" className="text-sm font-medium text-consware-dark">
          Nombre Completo *
        </Label>
        <Input
          id="master-nombreCompleto"
          type="text"
          placeholder="ejemplomaster"
          value={data.usuarioMaster.nombreCompleto}
          onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
          className={errors.nombreCompleto ? "border-destructive" : ""}
        />
        {errors.nombreCompleto && (
          <p className="text-xs text-destructive">{errors.nombreCompleto}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="master-identificacion" className="text-sm font-medium text-consware-dark">
          Número de Identificación *
        </Label>
        <Input
          id="master-identificacion"
          type="text"
          placeholder="900230687"
          value={data.usuarioMaster.identificacion}
          onChange={(e) => handleInputChange("identificacion", e.target.value)}
          className={errors.identificacion ? "border-destructive" : ""}
        />
        {errors.identificacion && (
          <p className="text-xs text-destructive">{errors.identificacion}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="master-celular" className="text-sm font-medium text-consware-dark">
          Celular *
        </Label>
        <Input
          id="master-celular"
          type="tel"
          placeholder="3104598210"
          value={data.usuarioMaster.celular}
          onChange={(e) => handleInputChange("celular", e.target.value)}
          className={errors.celular ? "border-destructive" : ""}
        />
        {errors.celular && (
          <p className="text-xs text-destructive">{errors.celular}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="master-correo" className="text-sm font-medium text-consware-dark">
          Correo Electrónico *
        </Label>
        <Input
          id="master-correo"
          type="email"
          placeholder="elpropiocv135@gmail.com"
          value={data.usuarioMaster.correo}
          onChange={(e) => handleInputChange("correo", e.target.value)}
          className={errors.correo ? "border-destructive" : ""}
        />
        {errors.correo && (
          <p className="text-xs text-destructive">{errors.correo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="master-username" className="text-sm font-medium text-consware-dark">
          Nombre de Usuario (Generado automáticamente)
        </Label>
        <Input
          id="master-username"
          type="text"
          value={data.usuarioMaster.username}
          disabled
          className="bg-consware-gray-medium text-consware-gray-primary"
        />
        <p className="text-xs text-consware-gray-primary">
          Se genera automáticamente basado en el nombre: MASTER{'{NOMBRE_SIN_ESPACIOS}'}
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          className="border-consware-gray-border text-consware-gray-primary hover:bg-consware-gray-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        
        <Button 
          onClick={validateAndNext}
          className="bg-primary hover:bg-consware-green-active text-primary-foreground font-medium px-6"
        >
          Continuar
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}