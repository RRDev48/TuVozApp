import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ActiveProfileProvider } from "./contexts/ActiveProfileContext";
import ExpresateProvider from "./contexts/ExpresateContext";
import PersonalizationProvider from "./contexts/PersonalizationContext";
import i18n from "./i18n";
import StackNavigator from "./navigation/Navigator";
import { PictogramUsageProvider } from "./feature/expresate/contexts/PictogramUsageContext";
import "./performance"; // Initialize performance monitoring

SplashScreen.preventAutoHideAsync();

const PictomindApp = () => {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActiveProfileProvider>
        <PersonalizationProvider>
          <ExpresateProvider>
            <PictogramUsageProvider>
              <StackNavigator />
            </PictogramUsageProvider>
          </ExpresateProvider>
        </PersonalizationProvider>
      </ActiveProfileProvider>
    </GestureHandlerRootView>
  );
};

export default PictomindApp;
