import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useState } from "react";

type AddressFormParams = {
  initialAddress?: string;
  onAdd?: (address: string) => void;
  onUpdate?: (address: string) => void;
  onDelete?: () => void;
};

export const useAddressForm = ({
  initialAddress = "",
  onAdd,
  onUpdate,
  onDelete,
}: AddressFormParams) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { transformText } = usePersonalization();

  const [address, setAddress] = useState(initialAddress);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSave = useCallback(() => {
    if (address.trim() === "") {
      setShowErrorModal(true);
      return;
    }

    if (onAdd) {
      onAdd(address);
    } else if (onUpdate) {
      onUpdate(address);
    }
    navigation.goBack();
  }, [address, onAdd, onUpdate, navigation]);

  const handleDelete = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
    }
    navigation.goBack();
  }, [onDelete, navigation]);

  return {
    address,
    setAddress,
    handleSave,
    handleDelete,
    confirmDelete,
    showErrorModal,
    setShowErrorModal,
    showConfirmModal,
    setShowConfirmModal,
  };
};
