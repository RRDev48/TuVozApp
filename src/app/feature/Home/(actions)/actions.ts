const getGreeting = (name?: string): string => {
  const hour: number = new Date().getHours();
  const userName = name ? ` ${name}` : "";

  if (hour >= 6 && hour < 13) {
    return `¡Buenos días${userName}!`;
  } else if (hour >= 13 && hour < 19) {
    return `¡Buenas tardes${userName}!`;
  } else {
    return `¡Buenas noches${userName}!`;
  }
};

export default getGreeting;
