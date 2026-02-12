// Definición de los parámetros de cada ruta del stack principal.
// Si una pantalla necesita props, se tipan aquí en lugar de `undefined`.

// Tipos reutilizables para pantallas de emergencias
type SelectionScreenParams<T extends string> = {
  [K in `current${Capitalize<T>}`]?: string;
} & {
  onSelect: (value: string) => void;
};

type AddScreenParams = {
  onAdd: (value: string) => void;
};

type EditScreenParams = {
  [key: string]: string | ((value: string) => void) | (() => void);
  onUpdate: (value: string) => void;
  onDelete: () => void;
};

type RootStackParamsList = {
  // Splash/Bienvenida
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  RecoveryCode: { email: string };
  NewPassword: { email: string };
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
  Emergencias: { fromSettings?: boolean };
  EmergenciasParte2: undefined;
  EmergencyProfile: undefined;

  // Pantallas de emergencias - Tipo de sangre
  BloodTypeSelection: {
    currentBloodType?: string;
    onSelect: (bloodType: string) => void;
  };

  // Pantallas de emergencias - Alergias
  AllergiesSelection: {
    currentAllergies?: string;
    onSelect: (allergies: string) => void;
  };
  AddAllergy: AddScreenParams;
  EditAllergy: {
    allergy: string;
    onUpdate: (allergy: string) => void;
    onDelete: () => void;
  };

  // Pantallas de emergencias - Medicaciones
  MedicationsSelection: {
    currentMedications?: string;
    onSelect: (medications: string) => void;
  };
  AddMedication: AddScreenParams;
  EditMedication: {
    medication: string;
    onUpdate: (medication: string) => void;
    onDelete: () => void;
  };

  // Pantallas de emergencias - Dirección
  AddressSelection: {
    currentAddress?: string;
    onSelect: (address: string) => void;
  };
  AddAddress: AddScreenParams;
  EditAddress: {
    address: string;
    onUpdate: (address: string) => void;
    onDelete: () => void;
  };

  // Pantallas de emergencias - Modo de alerta
  AlertModeSelection: {
    currentAlertMode?: string;
    onSelect: (alertMode: string) => void;
  };

  // Pantallas de emergencias - Notas
  NotesSelection: {
    currentNotes?: string;
    onSelect: (notes: string) => void;
  };

  // Pantallas de emergencias - Contacto de emergencia
  EmergencyContactSelection: {
    currentContactName?: string;
    currentCountryCode?: string;
    currentPhoneNumber?: string;
    onSelect: (name: string, phone: string) => void;
  };

  // Ajustes
  Ajustes: undefined;
  PersonalizationScreen: undefined;
  ProfilesConfigScreen: undefined;
  SupportScreen: undefined;
  NewSupportEntryScreen: undefined;
};

export default RootStackParamsList;
