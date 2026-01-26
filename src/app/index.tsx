import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersonalizationProvider } from "./contexts/PersonalizationContext";
import StackNavigator from "./navigation/Navigator";

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const PictomindApp = () => {
  const [fontsLoaded, fontError] = useFonts({
    "OpenDyslexic-Regular": require("./assets/fonts/OpenDyslexic-Regular.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersonalizationProvider>
        <StackNavigator />
      </PersonalizationProvider>
    </GestureHandlerRootView>
  );
};

export default PictomindApp;
