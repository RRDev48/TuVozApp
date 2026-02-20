export const ROLE_OPTIONS = [
  { id: "maestra_integradora", label: "Maestra Integradora" },
  { id: "personal_medico", label: "Personal Medico" },
  { id: "acompanante_terapeutico", label: "Acompañante Terapeutico" },
  { id: "familiar", label: "Familiar" },
] as const;

export const ROLE_LABELS: Record<string, string> = {
  self: "Usuario Principal",
  maestra_integradora: "Maestra Integradora",
  personal_medico: "Personal Médico",
  acompanante_terapeutico: "Acompañante Terapéutico",
  familiar: "Familiar",
};

export type RoleId = (typeof ROLE_OPTIONS)[number]["id"] | "self";
