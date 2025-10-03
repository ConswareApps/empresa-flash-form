import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface LegalRepresentativeStepProps {
  data: CompanyFormData;
  updateData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function LegalRepresentativeStep({ 
  data, 
  updateData, 
  onNext, 
  onPrev 
}: LegalRepresentativeStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.representanteLegal.identificacion.trim()) {
      newErrors.identificacion = "La identificación es requerida";
    }
    if (!data.representanteLegal.nombreCompleto.trim()) {
      newErrors.nombreCompleto = "El nombre completo es requerido";
    }
    if (!data.representanteLegal.celular.trim()) {
      newErrors.celular = "El celular es requerido";
    } else if (data.representanteLegal.celular.length !== 10) {
      newErrors.celular = "El celular debe tener exactamente 10 dígitos";
    }
    if (!data.representanteLegal.correoElectronico.trim()) {
      newErrors.correoElectronico = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.representanteLegal.correoElectronico)) {
      newErrors.correoElectronico = "El correo electrónico no es válido";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    updateData({
      representanteLegal: {
        ...data.representanteLegal,
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
      <div className="space-y-2">
        <Label htmlFor="rep-identificacion" className="text-sm font-medium text-consware-dark">
          Número de Identificación *
        </Label>
        <Input
          id="rep-identificacion"
          type="number"
          placeholder="Ej: 12345678 (cédula de ciudadanía)"
          value={data.representanteLegal.identificacion}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Solo números
            handleInputChange("identificacion", value);
          }}
          className={errors.identificacion ? "border-destructive" : ""}
          onKeyDown={(e) => {
            // Permitir solo números, backspace, delete, tab, escape, enter
            if (![
              'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
              'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
            ].includes(e.key) && !/^[0-9]$/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
        {errors.identificacion && (
          <p className="text-xs text-destructive">{errors.identificacion}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rep-nombreCompleto" className="text-sm font-medium text-consware-dark">
          Nombre Completo *
        </Label>
        <Input
          id="rep-nombreCompleto"
          type="text"
          placeholder="Ej: Juan Carlos Pérez García"
          value={data.representanteLegal.nombreCompleto}
          onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
          className={errors.nombreCompleto ? "border-destructive" : ""}
        />
        {errors.nombreCompleto && (
          <p className="text-xs text-destructive">{errors.nombreCompleto}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rep-celular" className="text-sm font-medium text-consware-dark">
          Celular *
        </Label>
        <Input
          id="rep-celular"
          type="tel"
          placeholder="Ej: 3001234567 (celular de 10 dígitos)"
          value={data.representanteLegal.celular}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ''); // Solo números
            if (value.length <= 10) { // Limitar a 10 dígitos
              handleInputChange("celular", value);
            }
          }}
          className={errors.celular ? "border-destructive" : ""}
          maxLength={10}
          onKeyDown={(e) => {
            // Permitir solo números, backspace, delete, tab, escape, enter
            if (![
              'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
              'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
            ].includes(e.key) && !/^[0-9]$/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
        {errors.celular && (
          <p className="text-xs text-destructive">{errors.celular}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rep-correoElectronico" className="text-sm font-medium text-consware-dark">
          Correo Electrónico *
        </Label>
        <Input
          id="rep-correoElectronico"
          type="email"
          placeholder="Ej: juan.perez@empresa.com.co"
          value={data.representanteLegal.correoElectronico}
          onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
          className={errors.correoElectronico ? "border-destructive" : ""}
        />
        {errors.correoElectronico && (
          <p className="text-xs text-destructive">{errors.correoElectronico}</p>
        )}
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