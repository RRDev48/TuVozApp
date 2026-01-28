import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

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

  const handleSave = useCallback(() => {
    if (address.trim() === "") {
      Alert.alert(
        transformText("Error"),
        transformText("Por favor ingrese una dirección"),
      );
      return;
    }

    if (onAdd) {
      onAdd(address);
    } else if (onUpdate) {
      onUpdate(address);
    }
    navigation.goBack();
  }, [address, onAdd, onUpdate, navigation, transformText]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      transformText("Eliminar dirección"),
      transformText("¿Estás seguro de que deseas eliminar esta dirección?"),
      [
        {
          text: transformText("Cancelar"),
          style: "cancel",
        },
        {
          text: transformText("Eliminar"),
          style: "destructive",
          onPress: () => {
            if (onDelete) {
              onDelete();
            }
            navigation.goBack();
          },
        },
      ],
    );
  }, [onDelete, navigation, transformText]);

  return {
    address,
    setAddress,
    handleSave,
    handleDelete,
  };
};
