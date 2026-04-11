import { useCallback, useEffect, useMemo, useState } from "react";
import { getRoutineByDate } from "../services/routine.service";
import { getMonday, getTodayIndex } from "../utils/dateHelpers";

export const useWeekRoutine = (profileId: string) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getMonday(new Date()),
  );

  const [selectedDayIndex, setSelectedDayIndex] = useState(getTodayIndex);

  const [routineId, setRoutineId] = useState<number>(0);

  const getDaysOfWeek = useCallback((start: Date) => {
    const monday = getMonday(start);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  const daysOfWeek = useMemo(
    () => getDaysOfWeek(currentWeekStart),
    [currentWeekStart, getDaysOfWeek],
  );

  const handleChangeWeek = useCallback((newStartDate: Date) => {
    setCurrentWeekStart(getMonday(newStartDate));
    setSelectedDayIndex(0);
  }, []);

  useEffect(() => {
    const fetchRoutine = async () => {
      if (!profileId) {
        setRoutineId(0);
        return;
      }

      const selectedDay = daysOfWeek[selectedDayIndex];
      const dateString = selectedDay.toISOString().slice(0, 10);

      const routine = await getRoutineByDate(profileId, dateString);
      setRoutineId(routine?.id ?? 0);
    };
    fetchRoutine();
  }, [daysOfWeek, selectedDayIndex, profileId]);

  return {
    currentWeekStart,
    selectedDayIndex,
    setSelectedDayIndex,
    routineId,
    daysOfWeek,
    handleChangeWeek,
  };
};
