import { useEffect, useState } from "react";
import { Medal } from "../models/routine.types";
import { getRoutineProgress } from "../services/progress.service";
import { getRoutineByDate } from "../services/routine.service";

export function useWeekMedals(profileId: string, weekDates: Date[]) {
  const [medals, setMedals] = useState<Medal[]>(Array(7).fill("none"));

  useEffect(() => {
    const fetchMedals = async () => {
      if (!profileId) return;

      const results: Medal[] = [];

      for (const date of weekDates) {
        const dateString = date.toISOString().slice(0, 10);

        const routine = await getRoutineByDate(profileId, dateString);
        if (!routine?.id) {
          results.push("none");
          continue;
        }

        const progress = await getRoutineProgress(routine.id);
        results.push(progress.medal);
      }

      setMedals(results);
    };

    fetchMedals();
  }, [weekDates, profileId]);

  return medals;
}
