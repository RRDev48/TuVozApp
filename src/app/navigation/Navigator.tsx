import { createStackNavigator } from "@react-navigation/stack";

import { colors } from "../design-system/themes/globalColors-theme";
import ForgotPasswordScreen from "../feature/Auth/ForgotPassword/ForgotPasswordScreen";
import LoginScreen from "../feature/Auth/Login/LoginScreen";
import CodeVerificationScreen from "../feature/Auth/Register/CodeVerificationScreen";
import EmailVerificationScreen from "../feature/Auth/Register/EmailVerificationScreen";
import PasswordSetupScreen from "../feature/Auth/Register/PasswordSetupScreen";
import RegisterInfoScreen from "../feature/Auth/Register/RegisterInfoScreen";
import RoleSelectionScreen from "../feature/Auth/Register/RoleSelectionScreen";
import UserTypeScreen from "../feature/Auth/Register/UserTypeScreen";
import HomeScreen from "../feature/Home/screen/HomeScreen";
import OnboardingScreen from "../feature/Onboarding/screen/OnboardingScreen";
import SplashScreen from "../feature/Splash/screen/SplashScreen";
import { RootStackParamsList } from "./navigation.types";

// Definición del stack principal tipado con RootStackParamsList
const Stack = createStackNavigator<RootStackParamsList>();

// Pantallas principales visibles desde el menú inferior o principal
// const mainScreens = [
//   { name: "Home", component: HomeScreen },
//   { name: "Expresate", component: ExpresateScreen },
//   { name: "Rutinas", component: RoutineScreen },
//   { name: "Tarjetas", component: CardsScreen },
//   { name: "Atajos", component: ShortcutScreen },
//   { name: "Emergencias", component: EmergencyScreen },
//   { name: "Ajustes", component: SettingsScreen },
//   { name: "PersonalizationScreen", component: PersonalizationScreen },
// ];

// Subpantallas de la sección "Exprésate" (por ahora usan SettingsScreen como placeholder)
// const expresateScreens = [
//   { name: "Acciones", component: SettingsScreen },
//   { name: "Objetos", component: SettingsScreen },
//   { name: "Preguntas", component: SettingsScreen },
//   { name: "Animales", component: SettingsScreen },
// ];

// Subpantallas de la sección "Tarjetas"
// const tarjetasScreens = [
//   { name: "PersonalizaTusTarjetas", component: SettingsScreen },
//   { name: "CreaNuevasTarjetas", component: SettingsScreen },
// ];

// Subpantallas de la sección "Atajos"
// const atajosScreens = [
//   { name: "MisDatos", component: SettingsScreen },
//   { name: "ComoMeSiento", component: SettingsScreen },
//   { name: "Ubicaciones", component: SettingsScreen },
//   { name: "YoQuiero", component: SettingsScreen },
// ];

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
      <Stack.Screen name="Home" component={HomeScreen} />
      {/* 
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

      {atajosScreens.map((screen) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name as keyof RootStackParamsList}
          component={screen.component}
        />
      ))} */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
