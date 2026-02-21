type AddScreenParams = {
  onAdd: (value: string) => void;
};

type RootStackParamsList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  RecoveryCode: { email: string };
  NewPassword: { email: string };
  UserType: undefined;
  RoleSelection: undefined;
  RegisterInfo: { role?: string };
  EmailVerification: { name: string; role?: string };
  PasswordSetup: { email: string; name: string; role?: string };
  CodeVerification: {
    email: string;
    password: string;
    name: string;
    role?: string;
  };

  Home: undefined;
  Expresate: undefined;
  CategoryPictograms: {
    categoryId: string;
    categoryName: string;
  };
  Rutinas: undefined;
  Tarjetas: undefined;
  Frases: undefined;
  Emergencias: { fromSettings?: boolean };
  EmergenciasParte2: {
    formData: {
      blood_type: string;
      allergies: string;
      medications: string;
      address: string;
      alert_type: string;
      emergency_contact_name: string;
      emergency_contact_phone: string;
      notes: string;
    };
  };
  EmergencyProfile: undefined;

  BloodTypeSelection: {
    currentBloodType?: string;
    onSelect: (bloodType: string) => void;
  };

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

  AlertModeSelection: {
    currentAlertMode?: string;
    onSelect: (alertMode: string) => void;
  };

  NotesSelection: {
    currentNotes?: string;
    onSelect: (notes: string) => void;
  };

  EmergencyContactSelection: {
    currentContactName?: string;
    currentCountryCode?: string;
    currentPhoneNumber?: string;
    onSelect: (name: string, phone: string) => void;
  };

  Ajustes: undefined;
  PersonalizationScreen: undefined;
  ProfilesConfigScreen: undefined;
  SupportScreen: undefined;
  NewSupportEntryScreen: undefined;
};

export default RootStackParamsList;
