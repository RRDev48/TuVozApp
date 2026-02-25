import { useEffect, useState } from "react";
import { Medal } from "../models/routine.types";
import { getRoutineProgress } from "../services/progress.service";

export function useRoutineProgress(
  routineId: number,
  refreshTrigger?: number | string,
) {
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [percent, setPercent] = useState(0);
  const [medal, setMedal] = useState<Medal>("none");

  useEffect(() => {
    if (!routineId) return;

    getRoutineProgress(routineId).then((progress) => {
      setCompleted(progress.completed);
      setTotal(progress.total);
      setPercent(progress.percent);
      setMedal(progress.medal);
    });
  }, [routineId, refreshTrigger]);

  return { completed, total, percent, medal };
}
