import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback } from "react";

interface SettingsButton {
  id: string;
  titleKey: string;
  subtitleKey: string;
  iconName: string;
  onPress: () => void;
  show: boolean;
}

export const useSettingsButtons = (currentUser: any, isLoading: boolean) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

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
      titleKey: "Perfiles",
      subtitleKey: "Configura tus perfiles",
      iconName: "person",
      onPress: handleNavigateToProfiles,
      show: true,
    },
    {
      id: "personalization",
      titleKey: "Personalizar",
      subtitleKey: "Configura colores y temas",
      iconName: "color-palette",
      onPress: handleNavigateToPersonalization,
      show: true,
    },
    {
      id: "support",
      titleKey: "Soporte",
      subtitleKey: "Ayuda y asistencia",
      iconName: "help-circle",
      onPress: handleNavigateToSupport,
      show: !isLoading && currentUser,
    },
    {
      id: "emergency",
      titleKey: "Editar Emergencia",
      subtitleKey: "Configura tu informacion de emergencia",
      iconName: "alert-circle",
      onPress: handleNavigateToEmergency,
      show: !isLoading && currentUser,
    },
  ];

  return buttons.filter((btn) => btn.show);
};
