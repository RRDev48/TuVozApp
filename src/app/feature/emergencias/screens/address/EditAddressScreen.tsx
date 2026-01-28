import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAddressForm } from "../../(hooks)/useAddressForm";

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
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
      backgroundColor: themedColors.background,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.darkGray,
      justifyContent: "center",
      alignItems: "center",
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
      marginLeft: -40,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: themedColors.text,
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 180,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: themedColors.text,
      marginBottom: 15,
    },
    input: {
      backgroundColor: colors.darkGray,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 16,
      color: themedColors.text,
      minHeight: 100,
      textAlignVertical: "top",
    },
    deleteButton: {
      position: "absolute",
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: colors.darkGray,
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
    saveButton: {
      position: "absolute",
      bottom: 110,
      left: 20,
      right: 20,
      backgroundColor: colors.green,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.black,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <CustomText style={styles.headerTitle}>
            {transformText("Editar dirección")}
          </CustomText>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Cuál es tu dirección?")}
        </CustomText>

        <TextInput
          style={styles.input}
          placeholder={transformText("Escribe tu dirección completa")}
          placeholderTextColor={colors.gray}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={4}
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <CustomText style={styles.saveButtonText}>
          {transformText("Guardar cambios")}
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <CustomText style={styles.deleteButtonText}>
          {transformText("Eliminar dirección")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default EditAddressScreen;
