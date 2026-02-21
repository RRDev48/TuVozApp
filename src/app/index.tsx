import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExpresateProvider from "./contexts/ExpresateContext";
import PersonalizationProvider from "./contexts/PersonalizationContext";
import StackNavigator from "./navigation/Navigator";

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const PictomindApp = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersonalizationProvider>
        <ExpresateProvider>
          <StackNavigator />
        </ExpresateProvider>
      </PersonalizationProvider>
    </GestureHandlerRootView>
  );
};

export default PictomindApp;
