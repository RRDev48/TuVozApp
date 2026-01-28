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
  BloodTypeSelection: {
    currentBloodType?: string;
    onSelect: (bloodType: string) => void;
  };
  AllergiesSelection: {
    currentAllergies?: string;
    onSelect: (allergies: string) => void;
  };
  AddAllergy: {
    onAdd: (allergy: string) => void;
  };
  EditAllergy: {
    allergy: string;
    onUpdate: (allergy: string) => void;
    onDelete: () => void;
  };
  MedicationsSelection: {
    currentMedications?: string;
    onSelect: (medications: string) => void;
  };
  AddMedication: {
    onAdd: (medication: string) => void;
  };
  EditMedication: {
    medication: string;
    onUpdate: (medication: string) => void;
    onDelete: () => void;
  };
  AddressSelection: {
    currentAddress?: string;
    onSelect: (address: string) => void;
  };
  AddAddress: {
    onAdd: (address: string) => void;
  };
  EditAddress: {
    address: string;
    onUpdate: (address: string) => void;
    onDelete: () => void;
  };
  Ajustes: undefined;
  PersonalizationScreen: undefined;
  ProfilesConfigScreen: undefined;
  SupportScreen: undefined;
  NewSupportEntryScreen: undefined;

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
