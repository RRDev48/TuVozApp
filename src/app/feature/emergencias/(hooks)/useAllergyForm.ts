import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useState } from "react";

export const SEVERITY_LEVELS = ["Leve", "Moderada", "Grave"];

type AllergyFormParams = {
  initialAllergy?: string;
  onAdd?: (allergy: string) => void;
  onUpdate?: (allergy: string) => void;
  onDelete?: () => void;
};

const parseAllergy = (allergyString: string) => {
  const match = allergyString.match(/^(.+)\s*\((.+)\)$/);
  if (match) {
    return { name: match[1].trim(), severity: match[2].trim() };
  }
  return { name: allergyString, severity: "Leve" };
};

export const useAllergyForm = ({
  initialAllergy = "",
  onAdd,
  onUpdate,
  onDelete,
}: AllergyFormParams) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { transformText } = usePersonalization();

  const parsed = parseAllergy(initialAllergy);
  const [allergyName, setAllergyName] = useState(parsed.name);
  const [selectedSeverity, setSelectedSeverity] = useState(parsed.severity);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSelectSeverity = useCallback((severity: string) => {
    setSelectedSeverity(severity);
    setIsDropdownOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    if (allergyName.trim() === "") {
      setShowErrorModal(true);
      return;
    }

    const formattedAllergy = `${allergyName} (${selectedSeverity})`;

    if (onAdd) {
      onAdd(formattedAllergy);
    } else if (onUpdate) {
      onUpdate(formattedAllergy);
    }
    navigation.goBack();
  }, [allergyName, selectedSeverity, onAdd, onUpdate, navigation]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
    navigation.goBack();
  }, [onDelete, navigation]);

  return {
    allergyName,
    setAllergyName,
    selectedSeverity,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectSeverity,
    handleSave,
    handleDelete,
    showErrorModal,
    setShowErrorModal,
  };
};
