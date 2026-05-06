import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
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
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();
  const route = useRoute<ProfileEditScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const profileId = route.params.profile.id;
  const initialName = route.params.profile.display_name;
  const initialAvatarUrl = route.params.profile.avatar_url ?? null;

  const {
    fullName,
    setFullName,
    avatarUrl,
    isPickingImage,
    handlePickAvatar,
    showError: showEditError,
    showSuccess,
    errorMessage: editErrorMessage,
    isSaving,
    handleSave,
    closeError: closeEditError,
    closeSuccess,
  } = useProfileEdit(profileId, initialName, initialAvatarUrl);

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
        avatarSection: {
          alignItems: "center",
          marginBottom: 24,
        },
        avatarPreview: {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: themedColors.cardBackground,
          borderWidth: 2,
          borderColor: themedColors.primary,
          marginBottom: 12,
        },
        avatarButton: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 12,
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderColor: themedColors.primary,
        },
        avatarButtonText: {
          color: themedColors.background,
          fontWeight: "bold",
          fontSize: 14,
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.headerContainer}>
        <ScreenTitle text={t('editingProfile')} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.avatarSection}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../../../../assets/image/adip_icon.png")
            }
            style={styles.avatarPreview}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => void handlePickAvatar()}
            disabled={isSaving || isDeleting || isPickingImage}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarButtonText}>
              {t(isPickingImage ? 'loadingImage' : 'changeAvatar')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.fieldLabel}>
          {t('fullName')}
        </Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder={t('enterName')}
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
            {t(isSaving ? 'saving' : 'continueButton')}
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
          {t(isDeleting ? 'deleting' : 'deleteProfile')}
        </Text>
      </TouchableOpacity>

      <ErrorModal
        visible={showEditError || showDeleteError}
        title={t('errorTitle')}
        message={editErrorMessage || deleteErrorMessage}
        onClose={() => {
          closeEditError();
          closeDeleteError();
        }}
      />

      <SuccessModal
        visible={showSuccess}
        title={t('successTitle')}
        message={t('profileUpdated')}
        onClose={closeSuccess}
      />

      <ConfirmationModal
        visible={showConfirmDelete}
        title={t('confirmDeleteProfile')}
        confirmText={t('deleteButton')}
        cancelText={t('cancelButton')}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </KeyboardAvoidingView>
  );
};

export default ProfileEditScreen;
