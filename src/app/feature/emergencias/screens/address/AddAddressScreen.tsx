import ErrorModal from "@/src/app/components/alerts/ErrorModal";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, Text, View } from "react-native";
import { useAddressForm } from "../../(hooks)/useAddressForm";
import { useAddressScreenStyles } from "../../(hooks)/useAddressScreenStyles";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type AddAddressScreenRouteProp = RouteProp<RootStackParamsList, "AddAddress">;
type AddAddressScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddAddress"
>;

const AddAddressScreen = () => {
  const navigation = useNavigation<AddAddressScreenNavigationProp>();
  const route = useRoute<AddAddressScreenRouteProp>();
  const { transformText } = usePersonalization();
  const styles = useAddressScreenStyles();

  const { address, setAddress, handleSave, showErrorModal, closeErrorModal } =
    useAddressForm({
      onAdd: route.params?.onAdd,
    });

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Agregar dirección")} />

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

      <SaveButton onPress={handleSave} />

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message="Por favor ingrese una dirección"
        onClose={closeErrorModal}
      />
    </View>
  );
};

export default AddAddressScreen;
