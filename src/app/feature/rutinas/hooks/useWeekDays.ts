export const useWeekDays = (startDate: Date): Date[] => {
  const getDaysOfWeek = (date: Date) => {
    const days: Date[] = [];
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  return getDaysOfWeek(startDate);
};
