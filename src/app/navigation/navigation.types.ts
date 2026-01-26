// Definición de los parámetros de cada ruta del stack principal.
// Si una pantalla necesita props, se tipan aquí en lugar de `undefined`.
type RootStackParamsList = {
  // Splash/Bienvenida
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  UserType: undefined;
  RoleSelection: undefined;
  RegisterInfo: { role?: string };
  EmailVerification: { name: string; age: string; role?: string };
  PasswordSetup: { email: string; name: string; age: string; role?: string };
  CodeVerification: {
    email: string;
    password: string;
    name: string;
    age: string;
    role?: string;
  };

  // Rutas principales
  Home: undefined;
  Expresate: undefined;
  Rutinas: undefined;
  Tarjetas: undefined;
  Frases: undefined;
  Emergencias: undefined;
  Ajustes: undefined;
  PersonalizationScreen: undefined;

  // Subrutas de "Exprésate"
  Acciones: undefined;
  Objetos: undefined;
  Preguntas: undefined;
  Animales: undefined;

  // Subrutas de "Tarjetas"
  PersonalizaTusTarjetas: undefined;
  CreaNuevasTarjetas: undefined;

  // Subrutas de "Frases"
  MisDatos: undefined;
  ComoMeSiento: undefined;
  Ubicaciones: undefined;
  YoQuiero: undefined;
};

export default RootStackParamsList;
