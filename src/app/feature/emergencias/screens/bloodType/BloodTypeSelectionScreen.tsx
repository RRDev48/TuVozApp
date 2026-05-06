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
import i18n from "@/src/app/i18n";

type BloodTypeSelectionScreenRouteProp = RouteProp<
  RootStackParamsList,
  "BloodTypeSelection"
>;
type BloodTypeSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "BloodTypeSelection"
>;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodTypeSelectionScreen = () => {
  const navigation = useNavigation<BloodTypeSelectionScreenNavigationProp>();
  const route = useRoute<BloodTypeSelectionScreenRouteProp>();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const [selectedBloodType, setSelectedBloodType] = useState<string>(
    route.params?.currentBloodType || "O-",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectBloodType = (type: string) => {
    setSelectedBloodType(type);
    setIsDropdownOpen(false);
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(selectedBloodType);
    }
    navigation.goBack();
  };

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

  return (
    <View style={styles.container}>
      {isDropdownOpen && (
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={i18n.t('bloodType')} />

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {i18n.t('yourBloodType')}
        </Text>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={styles.dropdownButtonText}>{selectedBloodType}</Text>
          <Ionicons
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color={themedColors.secondary}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <DropdownList
            items={BLOOD_TYPES}
            onSelectItem={handleSelectBloodType}
            maxHeight={250}
          />
        )}
      </View>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default BloodTypeSelectionScreen;
