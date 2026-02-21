import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useState } from "react";

export const FREQUENCY_OPTIONS = [
  "Diaria",
  "Cada 12 horas",
  "Cada 8 horas",
  "Semanal",
  "Mensual",
];

type MedicationFormParams = {
  initialMedication?: string;
  onAdd?: (medication: string) => void;
  onUpdate?: (medication: string) => void;
  onDelete?: () => void;
};

const parseMedication = (medicationString: string) => {
  const match = medicationString.match(/^(.+)\s*\((.+)\)$/);
  if (match) {
    return { name: match[1].trim(), frequency: match[2].trim() };
  }
  return { name: medicationString, frequency: "Diaria" };
};

export const useMedicationForm = ({
  initialMedication = "",
  onAdd,
  onUpdate,
  onDelete,
}: MedicationFormParams) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const { showErrorModal, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const parsed = parseMedication(initialMedication);
  const [medicationName, setMedicationName] = useState(parsed.name);
  const [selectedFrequency, setSelectedFrequency] = useState(parsed.frequency);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectFrequency = useCallback((frequency: string) => {
    setSelectedFrequency(frequency);
    setIsDropdownOpen(false);
  }, []);

  const handleSave = useCallback(() => {
    if (medicationName.trim() === "") {
      logAndShowError(
        "El nombre del medicamento no puede estar vacío",
        new Error("El nombre del medicamento no puede estar vacío"),
        {
          context: "medication_name_empty",
          metadata: {
            medication_name_length: medicationName.length,
            selected_frequency: selectedFrequency,
          },
        },
      );
      return;
    }

    const formattedMedication = `${medicationName} (${selectedFrequency})`;

    if (onAdd) {
      onAdd(formattedMedication);
    } else if (onUpdate) {
      onUpdate(formattedMedication);
    }
    navigation.goBack();
  }, [medicationName, selectedFrequency, onAdd, onUpdate, navigation]);

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
    navigation.goBack();
  }, [onDelete, navigation]);

  return {
    medicationName,
    setMedicationName,
    selectedFrequency,
    isDropdownOpen,
    setIsDropdownOpen,
    handleSelectFrequency,
    handleSave,
    handleDelete,
    showErrorModal,
    closeErrorModal,
  };
};
