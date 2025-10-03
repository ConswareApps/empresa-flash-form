// Paso 1: Información de la empresa - Solo UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ChevronRight } from "lucide-react";
import { CompanyFormData } from "@/types/company.types";
import { CompanyUtils } from "@/utils/company.utils";
import { COUNTRIES } from "@/constants/company.constants";
import { useFormValidation } from "@/hooks/useFormValidation";

interface CompanyInfoStepProps {
  data: CompanyFormData;
  updateData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
}

export default function CompanyInfoStep({ data, updateData, onNext }: CompanyInfoStepProps) {
  const { clearFieldError, getStepErrors, validateStep } = useFormValidation(data);
  const errors = getStepErrors(0);

  const validateAndNext = () => {
    const isValid = validateStep(0);
    if (isValid) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    const updates: any = { [field]: value };
    
    // Si se está actualizando el nombre de la empresa, también generar la versión sin espacios
    if (field === "nombreEmpresa" && typeof value === "string") {
      updates.nombreEmpresaSinEspacios = CompanyUtils.generateCompanyNameWithoutSpaces(value);
    }
    
    updateData(updates);
    
    // Clear error when user starts typing
    if (errors[field]) {
      clearFieldError(0, field);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-consware-green/10">
          <Building2 className="h-5 w-5 text-consware-green" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-consware-dark">
            Datos de la Empresa
          </h2>
          <p className="text-sm text-consware-gray-primary">
            Ingrese la información básica
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="identificacion">
            Identificación de la Empresa *
          </Label>
          <Input
            id="identificacion"
            type="text"
            placeholder="Ej: 900123456"
            value={data.identificacion}
            onChange={(e) => handleInputChange("identificacion", e.target.value)}
            className={errors.identificacion ? "border-red-500" : ""}
          />
          {errors.identificacion && (
            <p className="text-sm text-red-500">{errors.identificacion}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="digitoVerificador">
            Dígito Verificador *
          </Label>
          <Input
            id="digitoVerificador"
            type="number"
            min="0"
            max="9"
            placeholder="0-9"
            value={data.digitoVerificador || ""}
            onChange={(e) => handleInputChange("digitoVerificador", parseInt(e.target.value) || 0)}
            className={errors.digitoVerificador ? "border-red-500" : ""}
          />
          {errors.digitoVerificador && (
            <p className="text-sm text-red-500">{errors.digitoVerificador}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="nombreEmpresa">
            Nombre de la Empresa *
          </Label>
          <Input
            id="nombreEmpresa"
            type="text"
            placeholder="Ej: Mi Empresa S.A.S"
            value={data.nombreEmpresa}
            onChange={(e) => handleInputChange("nombreEmpresa", e.target.value)}
            className={errors.nombreEmpresa ? "border-red-500" : ""}
          />
          {errors.nombreEmpresa && (
            <p className="text-sm text-red-500">{errors.nombreEmpresa}</p>
          )}
          {data.nombreEmpresaSinEspacios && (
            <p className="text-xs text-consware-gray-primary">
              Nombre sin espacios: <span className="font-mono">{data.nombreEmpresaSinEspacios}</span>
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="celular">
            Celular de la Empresa *
          </Label>
          <Input
            id="celular"
            type="tel"
            placeholder="3001234567"
            maxLength={10}
            value={data.celular}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              handleInputChange("celular", value);
            }}
            className={errors.celular ? "border-red-500" : ""}
          />
          {errors.celular && (
            <p className="text-sm text-red-500">{errors.celular}</p>
          )}
          <p className="text-xs text-consware-gray-primary">
            Ingrese 10 dígitos sin espacios ni guiones
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">
            País *
          </Label>
          <Select
            value={data.pais}
            onValueChange={(value) => handleInputChange("pais", value)}
          >
            <SelectTrigger className={errors.pais ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccione un país" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pais && (
            <p className="text-sm text-red-500">{errors.pais}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button
          onClick={validateAndNext}
          className="flex items-center gap-2 bg-consware-green hover:bg-consware-green-active"
        >
          Continuar
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}