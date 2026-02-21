import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
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

  const { showErrorModal, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const [address, setAddress] = useState(initialAddress);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSave = useCallback(() => {
    if (address.trim() === "") {
      logAndShowError(
        "La dirección no puede estar vacía",
        new Error("La dirección no puede estar vacía"),
        {
          context: "address_validation_failed",
          metadata: { action: "save_address", address_length: address.length },
        },
      );
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
    closeErrorModal,
    showConfirmModal,
    setShowConfirmModal,
  };
};
