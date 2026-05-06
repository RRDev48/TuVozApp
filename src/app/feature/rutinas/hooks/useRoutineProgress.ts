import { useEffect, useRef, useState } from "react";
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
  const prevTriggerRef = useRef<string>("");

  useEffect(() => {
    if (!routineId) return;

    const triggerStr = String(refreshTrigger ?? "");
    if (triggerStr === prevTriggerRef.current) return;
    prevTriggerRef.current = triggerStr;

    getRoutineProgress(routineId).then((progress) => {
      setCompleted(progress.completed);
      setTotal(progress.total);
      setPercent(progress.percent);
      setMedal(progress.medal);
    });
  }, [routineId, refreshTrigger]);

  return { completed, total, percent, medal };
}
