export const COUNTRY_CODES = [
  { code: "+1", country: "Estados Unidos", flag: "🇺🇸" },
  { code: "+1", country: "Canadá", flag: "🇨🇦" },
  { code: "+52", country: "México", flag: "🇲🇽" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "Brasil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+51", country: "Perú", flag: "🇵🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+34", country: "España", flag: "🇪🇸" },
  { code: "+44", country: "Reino Unido", flag: "🇬🇧" },
  { code: "+33", country: "Francia", flag: "🇫🇷" },
  { code: "+49", country: "Alemania", flag: "🇩🇪" },
  { code: "+39", country: "Italia", flag: "🇮🇹" },
];

const COUNTRY_CODE_LIST = COUNTRY_CODES.map((c) => c.code);

export const parsePhoneNumber = (fullPhone: string) => {
  if (!fullPhone) return { countryCode: "+54", phoneNumber: "" };

  // Buscar el código de país más largo que coincida
  const sortedCodes = [...COUNTRY_CODE_LIST].sort(
    (a, b) => b.length - a.length,
  );

  for (const code of sortedCodes) {
    if (fullPhone.startsWith(code)) {
      return {
        countryCode: code,
        phoneNumber: fullPhone.substring(code.length).trim(),
      };
    }
  }

  return { countryCode: "+54", phoneNumber: fullPhone };
};
