import i18n from "@/src/app/i18n";

const getGreeting = (name?: string | null): string => {
  const hour: number = new Date().getHours();
  const userName = name ? ` ${name}` : "";

  let greetingKey = '';
  if (hour >= 6 && hour < 13) {
    greetingKey = 'goodMorning';
  } else if (hour >= 13 && hour < 19) {
    greetingKey = 'goodAfternoon';
  } else {
    greetingKey = 'goodEvening';
  }

  return `${i18n.t(greetingKey)}${userName}!`;
};

export default getGreeting;
