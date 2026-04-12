import { useEffect, useState } from "react";
import {
    DayProgress,
    calcularPorcentajeAcumuladoSemanal,
    calcularRachaActual,
    calcularRachaMasLarga,
    getAllRoutineProgress,
    tuvoDiaSinCompletar,
} from "../services/logros.service";

export interface LogroItem {
  id: string;
  label: string;
  unlocked: boolean;
  icon: string; // Ionicons name
  color: string;
}

export interface LogrosData {
  racha: LogroItem[];
  objetivos: LogroItem[];
  habitos: LogroItem[];
  rachaMasLarga: number;
  rachaActual: number;
  porcentajeAcumulado: number;
  loading: boolean;
}

const RACHA_MILESTONES = [2, 5, 7, 14, 30, 60, 90, 180, 365];
const OBJETIVO_MILESTONES = [100, 200, 300, 400, 500, 600];

const ORANGE = "#F5A623";
const CYAN = "#00BCD4";
const GREEN = "#4CAF50";
const GRAY = "#9E9E9E";

export function useLogros(profileId: string): LogrosData {
  const [days, setDays] = useState<DayProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    getAllRoutineProgress(profileId)
      .then(setDays)
      .catch(() => setDays([]))
      .finally(() => setLoading(false));
  }, [profileId]);

  const rachaMasLarga = calcularRachaMasLarga(days);
  const rachaActual = calcularRachaActual(days);
  const porcentajeAcumulado = calcularPorcentajeAcumuladoSemanal(days);
  const malHabito = tuvoDiaSinCompletar(days);

  const racha: LogroItem[] = RACHA_MILESTONES.map((dias) => ({
    id: `racha_${dias}`,
    label: `${dias} días`,
    unlocked: rachaMasLarga >= dias,
    icon: "flame",
    color: ORANGE,
  }));

  // Para objetivos: cada 100% representa que completó tareas equivalentes al total
  // acumulado semana tras semana. Simplificamos: 1 "100%" = 100 tareas completadas.
  const totalCompleted = days.reduce((sum, d) => sum + d.completed, 0);
  const objetivos: LogroItem[] = OBJETIVO_MILESTONES.map((pct, i) => ({
    id: `objetivo_${pct}`,
    label: `${pct}%`,
    unlocked: totalCompleted >= (i + 1) * 10, // cada 10 tareas completadas = 100%
    icon: "flag",
    color: CYAN,
  }));

  const habitos: LogroItem[] = [
    {
      id: "habito_mejor_comienzo",
      label: "Mejor comienzo",
      unlocked: rachaMasLarga >= 3,
      icon: "walk",
      color: ORANGE,
    },
    {
      id: "habito_buen_habito",
      label: "Buen hábito",
      unlocked: rachaMasLarga >= 7,
      icon: "thumbs-up",
      color: GREEN,
    },
    {
      id: "habito_mal_habito",
      label: "Mal hábito",
      unlocked: malHabito,
      icon: "hand-left",
      color: "#E53935",
    },
  ];

  return {
    racha,
    objetivos,
    habitos,
    rachaMasLarga,
    rachaActual,
    porcentajeAcumulado,
    loading,
  };
}
