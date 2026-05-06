type TranslateFunction = (key: string) => string;

const getGreeting = (name?: string | null, t?: TranslateFunction): string => {
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

  const translate = t || ((key: string) => {
    const { i18n } = require("@/src/app/i18n");
    return i18n.t(key);
  });

  return `${translate(greetingKey)}${userName}!`;
};

export default getGreeting;
