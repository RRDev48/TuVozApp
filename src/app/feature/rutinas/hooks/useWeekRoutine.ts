import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoutine, getRoutineByDate } from "../services/routine.service";

const getMonday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getTodayIndex = () => {
  const today = new Date();
  const day = today.getDay();
  return day === 0 ? 6 : day - 1;
};

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
      if (!profileId) return;

      const selectedDay = daysOfWeek[selectedDayIndex];
      const dateString = selectedDay.toISOString().slice(0, 10);

      let routine = await getRoutineByDate(profileId, dateString);
      if (!routine) {
        routine = await createRoutine(profileId, dateString);
      }
      setRoutineId(routine.id || 0);
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
