import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import ConfirmationModal from "@/src/app/feature/common/alerts/ConfirmationModal";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useAddressForm } from "../../hooks/useAddressForm";
import { useKeyboardVisibility } from "../../hooks/useKeyboardVisibility";

type EditAddressScreenRouteProp = RouteProp<RootStackParamsList, "EditAddress">;
type EditAddressScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EditAddress"
>;

const EditAddressScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<EditAddressScreenNavigationProp>();
  const route = useRoute<EditAddressScreenRouteProp>();
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
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 20,
          textAlign: "center",
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
      }),
    [themedColors],
  );

  const {
    address,
    setAddress,
    handleSave,
    handleDelete,
    confirmDelete,
    showErrorModal,
    closeErrorModal,
    showConfirmModal,
    setShowConfirmModal,
  } = useAddressForm({
    initialAddress: route.params?.address || "",
    onUpdate: route.params?.onUpdate,
    onDelete: route.params?.onDelete,
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={t('editAddress')} />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {t('whatIsYourAddress')}
        </Text>

        <ThemedTextInput
          placeholder={t('writeYourAddress')}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={4}
        />
      </ScrollView>

      <SaveButton onPress={handleSave} bottom={isKeyboardVisible ? 300 : 110} />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>
          {t('deleteAddress')}
        </Text>
      </TouchableOpacity>

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message="Por favor ingrese una dirección"
        onClose={closeErrorModal}
      />

      <ConfirmationModal
        visible={showConfirmModal}
        title="¿Estás seguro de que deseas eliminar esta dirección?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmModal(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default EditAddressScreen;
