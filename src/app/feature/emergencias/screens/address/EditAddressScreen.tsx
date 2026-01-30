import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAddressForm } from "../../(hooks)/useAddressForm";
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
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const { address, setAddress, handleSave, handleDelete } = useAddressForm({
    initialAddress: route.params?.address || "",
    onUpdate: route.params?.onUpdate,
    onDelete: route.params?.onDelete,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 180,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.text,
      marginBottom: 15,
    },
    deleteButton: {
      position: "absolute",
      bottom: 28,
      left: 20,
      right: 20,
      backgroundColor: "transparent",
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 2,
      borderColor: colors.red,
    },
    deleteButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.red,
    },
  });

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Editar dirección")} />

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Cuál es tu dirección?")}
        </CustomText>

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
        <CustomText style={styles.deleteButtonText}>
          {transformText("Eliminar dirección")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default EditAddressScreen;
