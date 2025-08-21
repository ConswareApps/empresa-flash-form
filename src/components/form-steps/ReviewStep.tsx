import { Button } from "@/components/ui/button";
import { ChevronLeft, Send, Building2, User, UserCheck } from "lucide-react";
import { CompanyFormData } from "../CompanyRegistrationForm";

interface ReviewStepProps {
  data: CompanyFormData;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
}

export default function ReviewStep({ data, onSubmit, onPrev, isSubmitting }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="bg-consware-bg-content rounded-lg p-4 border border-consware-gray-border">
        <div className="flex items-center mb-4">
          <Building2 className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-consware-dark">Información de la Empresa</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-consware-gray-primary">NIT:</span>
            <p className="font-medium text-consware-dark">{data.identificacion}-{data.digitoVerificador}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Nombre:</span>
            <p className="font-medium text-consware-dark">{data.nombreEmpresa}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Celular:</span>
            <p className="font-medium text-consware-dark">{data.celular}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Código Postal:</span>
            <p className="font-medium text-consware-dark">{data.codigoPostal}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">País:</span>
            <p className="font-medium text-consware-dark">{data.pais}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Ciudad:</span>
            <p className="font-medium text-consware-dark">{data.ciudad}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-consware-gray-primary">Dirección:</span>
            <p className="font-medium text-consware-dark">{data.direccion}, {data.barrio}</p>
          </div>
        </div>
      </div>

      <div className="bg-consware-bg-content rounded-lg p-4 border border-consware-gray-border">
        <div className="flex items-center mb-4">
          <UserCheck className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-consware-dark">Representante Legal</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-consware-gray-primary">Identificación:</span>
            <p className="font-medium text-consware-dark">{data.representanteLegal.identificacion}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Nombre:</span>
            <p className="font-medium text-consware-dark">{data.representanteLegal.nombreCompleto}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Celular:</span>
            <p className="font-medium text-consware-dark">{data.representanteLegal.celular}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Email:</span>
            <p className="font-medium text-consware-dark">{data.representanteLegal.correoElectronico}</p>
          </div>
        </div>
      </div>

      <div className="bg-consware-bg-content rounded-lg p-4 border border-consware-gray-border">
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-primary mr-2" />
          <h3 className="text-lg font-semibold text-consware-dark">Usuario Master</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-consware-gray-primary">Identificación:</span>
            <p className="font-medium text-consware-dark">{data.usuarioMaster.identificacion}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Nombre:</span>
            <p className="font-medium text-consware-dark">{data.usuarioMaster.nombreCompleto}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Celular:</span>
            <p className="font-medium text-consware-dark">{data.usuarioMaster.celular}</p>
          </div>
          <div>
            <span className="text-consware-gray-primary">Email:</span>
            <p className="font-medium text-consware-dark">{data.usuarioMaster.correo}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-consware-gray-primary">Username:</span>
            <p className="font-medium text-primary bg-primary/10 inline-px rounded px-2 py-1">
              {data.usuarioMaster.username}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-consware-warning/10 border border-consware-warning/20 rounded-lg p-4">
        <p className="text-sm text-consware-dark">
          <strong>Importante:</strong> Verifique que todos los datos sean correctos antes de enviar. 
          Una vez registrada la empresa, algunos datos no podrán ser modificados.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={isSubmitting}
          className="border-consware-gray-border text-consware-gray-primary hover:bg-consware-gray-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>
        
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-consware-success hover:bg-consware-success/90 text-white font-medium px-8"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registrando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Registrar Empresa
            </>
          )}
        </Button>
      </div>
    </div>
  );
}