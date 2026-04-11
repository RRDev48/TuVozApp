import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useAddressForm } from "../../hooks/useAddressForm";
import { useKeyboardVisibility } from "../../hooks/useKeyboardVisibility";

type AddAddressScreenRouteProp = RouteProp<RootStackParamsList, "AddAddress">;
type AddAddressScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AddAddress"
>;

const AddAddressScreen = () => {
  const navigation = useNavigation<AddAddressScreenNavigationProp>();
  const route = useRoute<AddAddressScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const isKeyboardVisible = useKeyboardVisibility();

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
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
      }),
    [themedColors],
  );

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

      <SaveButton onPress={handleSave} bottom={isKeyboardVisible ? 300 : 40} />

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
