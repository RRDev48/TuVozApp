import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ConfirmationModal from "../../../common/alerts/ConfirmationModal";
import ErrorModal from "../../../common/alerts/ErrorModal";
import SuccessModal from "../../../common/alerts/SuccessModal";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useProfileDelete } from "../../hooks/useProfileDelete";
import { useProfileEdit } from "../../hooks/useProfileEdit";

type ProfileEditScreenRouteProp = RouteProp<RootStackParamsList, "ProfileEdit">;
type ProfileEditScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ProfileEdit"
>;

const ProfileEditScreen = () => {
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();
  const route = useRoute<ProfileEditScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const profileId = route.params.profile.id;
  const initialName = route.params.profile.full_name;

  const {
    fullName,
    setFullName,
    showError: showEditError,
    showSuccess,
    errorMessage: editErrorMessage,
    isSaving,
    handleSave,
    closeError: closeEditError,
    closeSuccess,
  } = useProfileEdit(profileId, initialName);

  const {
    showConfirmDelete,
    showError: showDeleteError,
    errorMessage: deleteErrorMessage,
    isDeleting,
    handleDelete,
    confirmDelete,
    cancelDelete,
    closeError: closeDeleteError,
  } = useProfileDelete();

  const handleSaveSuccess = () => {
    navigation.goBack();
  };

  const handleDeleteComplete = (shouldSignOut: boolean) => {
    if (shouldSignOut) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    } else {
      navigation.goBack();
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        headerContainer: {
          paddingHorizontal: 20,
          marginBottom: 40,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
        },
        title: {
          fontSize: 32,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 40,
        },
        fieldLabel: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 10,
        },
        input: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 20,
          fontSize: 16,
          color: themedColors.background,
          marginBottom: 30,
        },
        buttonContainer: {
          position: "absolute",
          bottom: 100,
          left: 20,
          right: 20,
        },
        continueButton: {
          backgroundColor: colors.green,
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
        },
        continueButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.white,
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

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.headerContainer}>
        <ScreenTitle text={transformText("Configurando cuenta")} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {transformText("¡Vamos a conocernos!")}
        </Text>

        <Text style={styles.fieldLabel}>
          {transformText("Nombre completo")}
        </Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder={transformText("Ingresa el nombre")}
          placeholderTextColor={`${themedColors.background}80`}
        />
      </View>

      {/* Botón Continuar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => handleSave(handleSaveSuccess)}
          activeOpacity={0.8}
          disabled={isSaving || isDeleting}
        >
          <Text style={styles.continueButtonText}>
            {transformText(isSaving ? "Guardando..." : "Continuar")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón Eliminar perfil */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isSaving || isDeleting}
      >
        <Text style={styles.deleteButtonText}>
          {transformText(isDeleting ? "Eliminando..." : "Eliminar perfil")}
        </Text>
      </TouchableOpacity>

      <ErrorModal
        visible={showEditError || showDeleteError}
        title="Error"
        message={editErrorMessage || deleteErrorMessage}
        onClose={() => {
          closeEditError();
          closeDeleteError();
        }}
      />

      <SuccessModal
        visible={showSuccess}
        title="Éxito"
        message="Perfil actualizado correctamente"
        onClose={closeSuccess}
      />

      <ConfirmationModal
        visible={showConfirmDelete}
        title="¿Estás seguro de que deseas eliminar este perfil?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => confirmDelete(profileId, handleDeleteComplete)}
        onCancel={cancelDelete}
      />
    </View>
  );
};

export default ProfileEditScreen;
