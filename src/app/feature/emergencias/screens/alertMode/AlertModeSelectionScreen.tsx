import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import DropdownList from "../../components/DropdownList";
import SaveButton from "../../components/SaveButton";
import { EmergencyAlertType } from "../../models/emergency.types";

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
] as const satisfies ReadonlyArray<{
  value: EmergencyAlertType;
  label: string;
}>;

const AlertModeSelectionScreen = () => {
  const navigation = useNavigation<AlertModeSelectionScreenNavigationProp>();
  const route = useRoute<AlertModeSelectionScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const [selectedAlertMode, setSelectedAlertMode] =
    useState<EmergencyAlertType>(route.params?.currentAlertMode || "call");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
        dropdownButton: {
          width: "100%",
          backgroundColor: themedColors.primary,
          borderRadius: 16,
          paddingVertical: 18,
          paddingHorizontal: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        },
        dropdownButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        overlay: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }),
    [themedColors],
  );

  const handleSelectAlertMode = (value: EmergencyAlertType) => {
    setSelectedAlertMode(value);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(selectedAlertMode);
    }
    navigation.goBack();
  };

  const getAlertModeLabel = (value: EmergencyAlertType): string => {
    const mode = ALERT_MODES.find((m) => m.value === value);
    return mode ? mode.label : value;
  };

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
        <Text style={styles.sectionTitle}>
          {transformText("¿Cómo deseas activar\nla alerta?")}
        </Text>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownButtonText}>
            {getAlertModeLabel(selectedAlertMode)}
          </Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color={themedColors.secondary}
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
