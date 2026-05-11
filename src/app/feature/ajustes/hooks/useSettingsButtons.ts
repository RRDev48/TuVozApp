import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { authService } from "@/src/app/feature/start/Auth/services/auth.Service";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback } from "react";

type CurrentAuthUser = Awaited<ReturnType<typeof authService.getCurrentUser>>;

export interface SettingsButton {
  id: string;
  titleKey: string;
  subtitleKey: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  show: boolean;
}

import { useActiveProfile } from "@/src/app/contexts/ActiveProfileContext";

export const useSettingsButtons = (
  currentUser: CurrentAuthUser,
  isLoading: boolean,
) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { displayName } = useActiveProfile();

  const handleNavigateToProfiles = useCallback(() => {
    navigation.navigate("ProfilesConfigScreen");
  }, [navigation]);

  const handleNavigateToPersonalization = useCallback(() => {
    navigation.navigate("PersonalizationScreen");
  }, [navigation]);

  const handleNavigateToSupport = useCallback(() => {
    navigation.navigate("SupportScreen");
  }, [navigation]);

  const handleNavigateToEmergency = useCallback(() => {
    navigation.navigate("Emergencias", { fromSettings: true });
  }, [navigation]);

  const buttons: SettingsButton[] = [
    {
      id: "profiles",
      titleKey: "profiles",
      subtitleKey: "configureProfiles",
      iconName: "person",
      onPress: handleNavigateToProfiles,
      show: true, // Siempre mostrar para poder cambiar de perfil
    },
    {
      id: "personalization",
      titleKey: "personalize",
      subtitleKey: "configureColors",
      iconName: "color-palette",
      onPress: handleNavigateToPersonalization,
      show: true,
    },
    {
      id: "support",
      titleKey: "supportOption",
      subtitleKey: "helpAssistance",
      iconName: "help-circle",
      onPress: handleNavigateToSupport,
      show: true,
    },
    {
      id: "emergency",
      titleKey: "editEmergency",
      subtitleKey: "configureEmergency",
      iconName: "alert-circle",
      onPress: handleNavigateToEmergency,
      show: !!displayName,
    },
  ];

  return buttons.filter((btn) => btn.show);
};
