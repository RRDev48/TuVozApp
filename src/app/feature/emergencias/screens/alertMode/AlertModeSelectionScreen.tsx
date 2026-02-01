import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAlertModeSelectionStyles } from "../../(hooks)/useSelectionScreenStyles";
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
  const { transformText, getThemedColors } = usePersonalization();
  const styles = useAlertModeSelectionStyles();
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
