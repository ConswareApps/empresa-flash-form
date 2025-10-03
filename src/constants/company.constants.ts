// Constantes para el dominio de empresas
import { Country } from '@/types/company.types';

export const COUNTRIES: Country[] = [
  { label: "Colombia", value: "COL" },
  { label: "Panamá", value: "PAN" },
  { label: "México", value: "MEX" },
  { label: "Perú", value: "PER" },
];

export const FORM_CONSTRAINTS = {
  PHONE_LENGTH: 10,
  DIGIT_VERIFIER_MIN: 0,
  DIGIT_VERIFIER_MAX: 9,
} as const;

