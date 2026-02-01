import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAddressForm } from "../../(hooks)/useAddressForm";
import { useEditAddressScreenStyles } from "../../(hooks)/useEditAddressScreenStyles";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type EditAddressScreenRouteProp = RouteProp<RootStackParamsList, "EditAddress">;
type EditAddressScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EditAddress"
>;

const EditAddressScreen = () => {
  const navigation = useNavigation<EditAddressScreenNavigationProp>();
  const route = useRoute<EditAddressScreenRouteProp>();
  const { transformText } = usePersonalization();
  const styles = useEditAddressScreenStyles();

  const { address, setAddress, handleSave, handleDelete } = useAddressForm({
    initialAddress: route.params?.address || "",
    onUpdate: route.params?.onUpdate,
    onDelete: route.params?.onDelete,
  });

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Editar dirección")} />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {transformText("¿Cuál es tu dirección?")}
        </Text>

        <ThemedTextInput
          placeholder={transformText("Escribe tu dirección completa")}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={4}
        />
      </ScrollView>

      <SaveButton onPress={handleSave} bottom={110} />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>
          {transformText("Eliminar dirección")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAddressScreen;
