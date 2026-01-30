import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import DropdownList from "../../components/DropdownList";
import SaveButton from "../../components/SaveButton";

type AlertModeSelectionScreenRouteProp = RouteProp<
  RootStackParamsList,
  "AlertModeSelection"
>;
type AlertModeSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AlertModeSelection"
>;

const ALERT_MODES = [
  { value: "call", label: "Llamada" },
  { value: "whatsapp_location", label: "WhatsApp con ubicación" },
];

const AlertModeSelectionScreen = () => {
  const navigation = useNavigation<AlertModeSelectionScreenNavigationProp>();
  const route = useRoute<AlertModeSelectionScreenRouteProp>();
  const { getThemedColors, transformText, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();

  const [selectedAlertMode, setSelectedAlertMode] = useState<string>(
    route.params?.currentAlertMode || "call",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectAlertMode = (value: string) => {
    setSelectedAlertMode(value);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(selectedAlertMode);
    }
    navigation.goBack();
  };

  const getAlertModeLabel = (value: string): string => {
    const mode = ALERT_MODES.find((m) => m.value === value);
    return mode ? mode.label : value;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      marginBottom: 30,
    },
    dropdownButton: {
      width: "100%",
      backgroundColor: temaOscuro ? colors.white : themedColors.primary,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    dropdownButtonText: {
      fontSize: 20,
      fontWeight: "bold",
      color: temaOscuro ? colors.blue : colors.white,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      {isDropdownOpen && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Modo de alerta")} />

      <View style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Cómo deseas activar\nla alerta?")}
        </CustomText>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <CustomText style={styles.dropdownButtonText}>
            {getAlertModeLabel(selectedAlertMode)}
          </CustomText>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color={temaOscuro ? colors.blue : colors.white}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <DropdownList
            items={ALERT_MODES.map((mode) => mode.label)}
            onSelectItem={(label) => {
              const mode = ALERT_MODES.find((m) => m.label === label);
              if (mode) handleSelectAlertMode(mode.value);
            }}
          />
        )}
      </View>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default AlertModeSelectionScreen;
