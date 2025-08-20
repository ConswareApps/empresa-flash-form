import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface CompanyInfoStepProps {
  data: CompanyFormData;
  updateData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
}

export default function CompanyInfoStep({ data, updateData, onNext }: CompanyInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};

    if (!data.identificacion.trim()) {
      newErrors.identificacion = "La identificación es requerida";
    }
    if (!data.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = "El nombre de la empresa es requerido";
    }
    if (!data.digitoVerificador || data.digitoVerificador < 0 || data.digitoVerificador > 9) {
      newErrors.digitoVerificador = "El dígito verificador debe ser entre 0 y 9";
    }
    if (!data.celular.trim()) {
      newErrors.celular = "El celular es requerido";
    }
    if (!data.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }
    if (!data.barrio.trim()) {
      newErrors.barrio = "El barrio es requerido";
    }
    if (!data.codigoPostal.trim()) {
      newErrors.codigoPostal = "El código postal es requerido";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    updateData({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="identificacion" className="text-sm font-medium text-consware-dark">
            NIT de la Empresa *
          </Label>
          <Input
            id="identificacion"
            type="text"
            placeholder="900230988"
            value={data.identificacion}
            onChange={(e) => handleInputChange("identificacion", e.target.value)}
            className={errors.identificacion ? "border-destructive" : ""}
          />
          {errors.identificacion && (
            <p className="text-xs text-destructive">{errors.identificacion}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="digitoVerificador" className="text-sm font-medium text-consware-dark">
            Dígito Verificador *
          </Label>
          <Input
            id="digitoVerificador"
            type="number"
            placeholder="5"
            min="0"
            max="9"
            value={data.digitoVerificador || ""}
            onChange={(e) => handleInputChange("digitoVerificador", parseInt(e.target.value) || 0)}
            className={errors.digitoVerificador ? "border-destructive" : ""}
          />
          {errors.digitoVerificador && (
            <p className="text-xs text-destructive">{errors.digitoVerificador}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombreEmpresa" className="text-sm font-medium text-consware-dark">
          Nombre de la Empresa *
        </Label>
        <Input
          id="nombreEmpresa"
          type="text"
          placeholder="EMPRESA DE EJEMPLO HO4.0"
          value={data.nombreEmpresa}
          onChange={(e) => handleInputChange("nombreEmpresa", e.target.value)}
          className={errors.nombreEmpresa ? "border-destructive" : ""}
        />
        {errors.nombreEmpresa && (
          <p className="text-xs text-destructive">{errors.nombreEmpresa}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="celular" className="text-sm font-medium text-consware-dark">
          Celular de la Empresa *
        </Label>
        <Input
          id="celular"
          type="tel"
          placeholder="3104598210"
          value={data.celular}
          onChange={(e) => handleInputChange("celular", e.target.value)}
          className={errors.celular ? "border-destructive" : ""}
        />
        {errors.celular && (
          <p className="text-xs text-destructive">{errors.celular}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion" className="text-sm font-medium text-consware-dark">
          Dirección *
        </Label>
        <Input
          id="direccion"
          type="text"
          placeholder="Calle 123 # 45-67"
          value={data.direccion}
          onChange={(e) => handleInputChange("direccion", e.target.value)}
          className={errors.direccion ? "border-destructive" : ""}
        />
        {errors.direccion && (
          <p className="text-xs text-destructive">{errors.direccion}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="barrio" className="text-sm font-medium text-consware-dark">
            Barrio *
          </Label>
          <Input
            id="barrio"
            type="text"
            placeholder="LA LIS"
            value={data.barrio}
            onChange={(e) => handleInputChange("barrio", e.target.value)}
            className={errors.barrio ? "border-destructive" : ""}
          />
          {errors.barrio && (
            <p className="text-xs text-destructive">{errors.barrio}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigoPostal" className="text-sm font-medium text-consware-dark">
            Código Postal *
          </Label>
          <Input
            id="codigoPostal"
            type="text"
            placeholder="123123"
            value={data.codigoPostal}
            onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
            className={errors.codigoPostal ? "border-destructive" : ""}
          />
          {errors.codigoPostal && (
            <p className="text-xs text-destructive">{errors.codigoPostal}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
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