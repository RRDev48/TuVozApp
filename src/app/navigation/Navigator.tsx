import { createStackNavigator } from "@react-navigation/stack";

import { colors } from "../design-system/themes/globalColors-theme";
import NewSupportEntryScreen from "../feature/ajustes/screens/NewSupportEntryScreen";
import PersonalizacionScreen from "../feature/ajustes/screens/PersonalizacionScreen";
import SettingsScreen from "../feature/ajustes/screens/SettingsScreen";
import SupportScreen from "../feature/ajustes/screens/SupportScreen";
import ForgotPasswordScreen from "../feature/Auth/ForgotPassword/ForgotPasswordScreen";
import LoginScreen from "../feature/Auth/Login/LoginScreen";
import CodeVerificationScreen from "../feature/Auth/Register/CodeVerificationScreen";
import EmailVerificationScreen from "../feature/Auth/Register/EmailVerificationScreen";
import PasswordSetupScreen from "../feature/Auth/Register/PasswordSetupScreen";
import RegisterInfoScreen from "../feature/Auth/Register/RegisterInfoScreen";
import RoleSelectionScreen from "../feature/Auth/Register/RoleSelectionScreen";
import UserTypeScreen from "../feature/Auth/Register/UserTypeScreen";
import EmergencyScreen from "../feature/emergencias/screens/EmergencyScreen";
import ExpresateScreen from "../feature/expresate/screens/ExpresateScreen";
import ShortcutScreen from "../feature/frases/screens/ShortcutScreen";
import HomeScreen from "../feature/Home/screen/HomeScreen";
import OnboardingScreen from "../feature/Onboarding/screen/OnboardingScreen";
import RoutineScreen from "../feature/rutinas/screens/RoutineScreen";
import SplashScreen from "../feature/Splash/screen/SplashScreen";
import CardsScreen from "../feature/tarjetas/screens/TarjetasScreen";
import RootStackParamsList from "./navigation.types";

// Definición del stack principal tipado con RootStackParamsList
const Stack = createStackNavigator<RootStackParamsList>();

const mainScreens = [
  { name: "Home", component: HomeScreen },
  { name: "Expresate", component: ExpresateScreen },
  { name: "Rutinas", component: RoutineScreen },
  { name: "Tarjetas", component: CardsScreen },
  { name: "Frases", component: ShortcutScreen },
  { name: "Emergencias", component: EmergencyScreen },
  { name: "Ajustes", component: SettingsScreen },
];

const expresateScreens = [
  { name: "Acciones", component: SettingsScreen },
  { name: "Objetos", component: SettingsScreen },
  { name: "Preguntas", component: SettingsScreen },
  { name: "Animales", component: SettingsScreen },
];

const tarjetasScreens = [
  { name: "PersonalizaTusTarjetas", component: SettingsScreen },
  { name: "CreaNuevasTarjetas", component: SettingsScreen },
];

const frasesScreens = [
  { name: "MisDatos", component: SettingsScreen },
  { name: "ComoMeSiento", component: SettingsScreen },
  { name: "Ubicaciones", component: SettingsScreen },
  { name: "YoQuiero", component: SettingsScreen },
];

// Navegador principal de la app.
// Registra todas las pantallas del stack reutilizando las listas definidas arriba.
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
      {/* Pantalla de bienvenida */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="UserType" component={UserTypeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="RegisterInfo" component={RegisterInfoScreen} />
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />
      <Stack.Screen
        name="CodeVerification"
        component={CodeVerificationScreen}
      />
      <Stack.Screen name="PasswordSetup" component={PasswordSetupScreen} />
      <Stack.Screen
        name="PersonalizationScreen"
        component={PersonalizacionScreen}
      />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen
        name="NewSupportEntryScreen"
        component={NewSupportEntryScreen}
      />

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

      {tarjetasScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))}

      {frasesScreens.map((screen) => (
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
