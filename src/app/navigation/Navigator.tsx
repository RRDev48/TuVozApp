import { createStackNavigator } from "@react-navigation/stack";

import { colors } from "../design-system/themes/globalColors-theme";
import SettingsScreen from "../feature/ajustes/screens/main/SettingsScreen";
import PersonalizacionScreen from "../feature/ajustes/screens/personalization/PersonalizacionScreen";
import NewSupportEntryScreen from "../feature/ajustes/screens/support/NewSupportEntryScreen";
import SupportScreen from "../feature/ajustes/screens/support/SupportScreen";
import AddAddressScreen from "../feature/emergencias/screens/address/AddAddressScreen";
import AddressScreen from "../feature/emergencias/screens/address/AddressScreen";
import EditAddressScreen from "../feature/emergencias/screens/address/EditAddressScreen";
import AlertModeSelectionScreen from "../feature/emergencias/screens/alertMode/AlertModeSelectionScreen";
import AddAllergyScreen from "../feature/emergencias/screens/allergy/AddAllergyScreen";
import AllergiesScreen from "../feature/emergencias/screens/allergy/AllergiesScreen";
import EditAllergyScreen from "../feature/emergencias/screens/allergy/EditAllergyScreen";
import BloodTypeSelectionScreen from "../feature/emergencias/screens/bloodType/BloodTypeSelectionScreen";
import EmergencyScreen from "../feature/emergencias/screens/configuration/EmergencyScreen";
import EmergencyScreen2 from "../feature/emergencias/screens/configuration/EmergencyScreen2";
import EmergencyContactScreen from "../feature/emergencias/screens/emergencyContact/EmergencyContactScreen";
import EmergencyProfileScreen from "../feature/emergencias/screens/main/EmergencyProfileScreen";
import AddMedicationScreen from "../feature/emergencias/screens/medication/AddMedicationScreen";
import EditMedicationScreen from "../feature/emergencias/screens/medication/EditMedicationScreen";
import MedicationsScreen from "../feature/emergencias/screens/medication/MedicationsScreen";
import NotesScreen from "../feature/emergencias/screens/notes/NotesScreen";
import ExpresateScreen from "../feature/expresate/screens/ExpresateScreen";
import ShortcutScreen from "../feature/frases/screens/ShortcutScreen";
import HomeScreen from "../feature/Home/screen/HomeScreen";
import RoutineScreen from "../feature/rutinas/screens/RoutineScreen";
import ForgotPasswordScreen from "../feature/start/Auth/ForgotPassword/ForgotPasswordScreen";
import NewPasswordScreen from "../feature/start/Auth/ForgotPassword/NewPasswordScreen";
import RecoveryCodeScreen from "../feature/start/Auth/ForgotPassword/RecoveryCodeScreen";
import LoginScreen from "../feature/start/Auth/Login/LoginScreen";
import CodeVerificationScreen from "../feature/start/Auth/Register/CodeVerificationScreen";
import EmailVerificationScreen from "../feature/start/Auth/Register/EmailVerificationScreen";
import PasswordSetupScreen from "../feature/start/Auth/Register/PasswordSetupScreen";
import RegisterInfoScreen from "../feature/start/Auth/Register/RegisterInfoScreen";
import RoleSelectionScreen from "../feature/start/Auth/Register/RoleSelectionScreen";
import UserTypeScreen from "../feature/start/Auth/Register/UserTypeScreen";
import OnboardingScreen from "../feature/start/Onboarding/screen/OnboardingScreen";
import SplashScreen from "../feature/start/Splash/screen/SplashScreen";
import CardsScreen from "../feature/tarjetas/screens/TarjetasScreen";
import RootStackParamsList from "./navigation.types";

// Definición del stack principal tipado con RootStackParamsList
const Stack = createStackNavigator<RootStackParamsList>();

const authScreens = [
  { name: "Splash", component: SplashScreen },
  { name: "Onboarding", component: OnboardingScreen },
  { name: "Login", component: LoginScreen },
  { name: "ForgotPassword", component: ForgotPasswordScreen },
  { name: "RecoveryCode", component: RecoveryCodeScreen },
  { name: "NewPassword", component: NewPasswordScreen },
  { name: "UserType", component: UserTypeScreen },
  { name: "RoleSelection", component: RoleSelectionScreen },
  { name: "RegisterInfo", component: RegisterInfoScreen },
  { name: "EmailVerification", component: EmailVerificationScreen },
  { name: "CodeVerification", component: CodeVerificationScreen },
  { name: "PasswordSetup", component: PasswordSetupScreen },
];

const emergencyScreens = [
  { name: "BloodTypeSelection", component: BloodTypeSelectionScreen },
  { name: "AllergiesSelection", component: AllergiesScreen },
  { name: "AddAllergy", component: AddAllergyScreen },
  { name: "EditAllergy", component: EditAllergyScreen },
  { name: "MedicationsSelection", component: MedicationsScreen },
  { name: "AddMedication", component: AddMedicationScreen },
  { name: "EditMedication", component: EditMedicationScreen },
  { name: "AddressSelection", component: AddressScreen },
  { name: "AddAddress", component: AddAddressScreen },
  { name: "EditAddress", component: EditAddressScreen },
  { name: "AlertModeSelection", component: AlertModeSelectionScreen },
  { name: "NotesSelection", component: NotesScreen },
  { name: "EmergencyContactSelection", component: EmergencyContactScreen },
];

const settingsScreens = [
  { name: "PersonalizationScreen", component: PersonalizacionScreen },
  { name: "SupportScreen", component: SupportScreen },
  { name: "NewSupportEntryScreen", component: NewSupportEntryScreen },
];

const mainScreens = [
  { name: "Home", component: HomeScreen },
  { name: "Expresate", component: ExpresateScreen },
  { name: "Rutinas", component: RoutineScreen },
  { name: "Tarjetas", component: CardsScreen },
  { name: "Frases", component: ShortcutScreen },
  { name: "Emergencias", component: EmergencyScreen },
  { name: "EmergenciasParte2", component: EmergencyScreen2 },
  { name: "EmergencyProfile", component: EmergencyProfileScreen },
  { name: "Ajustes", component: SettingsScreen },
];

const expresateScreens = [
  { name: "Acciones", component: SettingsScreen },
  { name: "Objetos", component: SettingsScreen },
  { name: "Preguntas", component: SettingsScreen },
  { name: "Animales", component: SettingsScreen },
];

// Navegador principal de la app.
const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTitle: "",
      }}
    >
      {authScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))}

      {emergencyScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))}

      {settingsScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))}

      {mainScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))}

      {expresateScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackNavigator;
