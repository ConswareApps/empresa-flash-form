// Selector de entorno elegante y optimizado
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EnvironmentManager, Environment, ENVIRONMENT_CONFIGS } from '@/config/environment.config';

interface EnvironmentSelectorProps {
  className?: string;
}

export default function EnvironmentSelector({ className = "" }: EnvironmentSelectorProps) {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment | null>(
    EnvironmentManager.getCurrentEnvironment()
  );

  const handleEnvironmentChange = (environment: Environment) => {
    EnvironmentManager.setEnvironment(environment);
    setCurrentEnvironment(environment);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500">Entorno:</span>
      
      <Select value={currentEnvironment || ""} onValueChange={handleEnvironmentChange}>
        <SelectTrigger className="w-24 h-7 text-xs border-gray-300">
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          {EnvironmentManager.getAvailableEnvironments().map(({ key, config }) => (
            <SelectItem key={key} value={key} className="text-xs">
              {config.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentEnvironment && (
        <Badge 
          variant={currentEnvironment === 'PRD' ? 'destructive' : 'secondary'}
          className="text-xs px-2 py-0.5"
        >
          {ENVIRONMENT_CONFIGS[currentEnvironment].description}
        </Badge>
      )}
    </div>
  );
}
