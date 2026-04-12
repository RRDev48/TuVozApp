import type { UserRole } from "@/src/app/feature/common/models/database.types";
import type {
    EmergencyAlertType,
    EmergencyFormData,
} from "@/src/app/feature/emergencias/models/emergency.types";

type AddScreenParams = {
  onAdd: (value: string) => void;
};

type RootStackParamsList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  LoginHelp: undefined;
  LoginSupportTicket: undefined;
  ForgotPassword: undefined;
  RecoveryCode: { email: string };
  NewPassword: { email: string };
  UserType: undefined;
  RoleSelection: { isOwner?: boolean; ownerUserId?: string };
  RegisterInfo: { role?: UserRole; isOwner?: boolean; ownerUserId?: string };
  EmailVerification: {
    name: string;
    role?: UserRole;
    isOwner?: boolean;
    ownerUserId?: string;
  };
  PasswordSetup: {
    email: string;
    name: string;
    role?: UserRole;
    isOwner?: boolean;
    ownerUserId?: string;
  };
  TermsAndConditions: undefined;
  CodeVerification: {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
    isOwner?: boolean;
    ownerUserId?: string;
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
    formData: EmergencyFormData;
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
    currentAlertMode?: EmergencyAlertType;
    onSelect: (alertMode: EmergencyAlertType) => void;
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
  ProfileEdit: {
    profile: {
      id: string;
      display_name: string;
      avatar_url?: string | null;
    };
  };
  SupportScreen: undefined;
  NewSupportEntryScreen: undefined;
};

export default RootStackParamsList;
