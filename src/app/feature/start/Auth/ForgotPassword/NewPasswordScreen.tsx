import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import i18n from "@/src/app/i18n";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../common/BackButton";
import VerificationErrorModal from "../components/VerificationErrorModal";
import VerificationSuccessModal from "../components/VerificationSuccessModal";
import { usePasswordRecovery } from "../hooks/usePasswordRecovery";

async function showFormError(
  logAndShowError: (
    errorMessage: string,
    error?: Error,
    context?: Record<string, unknown>,
    severity?: "info" | "warning" | "error" | "critical",
  ) => Promise<void>,
  message: string,
  context: Record<string, unknown>,
) {
  await logAndShowError(message, new Error(message), context);
}

type NewPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "NewPassword"
>;

type NewPasswordScreenRouteProp = RouteProp<RootStackParamsList, "NewPassword">;

const NewPasswordScreen = () => {
  const navigation = useNavigation<NewPasswordScreenNavigationProp>();
  const route = useRoute<NewPasswordScreenRouteProp>();
  const { email = "" } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const { updatePassword, isUpdating } = usePasswordRecovery();

  const handleUpdatePassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      await showFormError(
        logAndShowError,
        i18n.t('completeAllFields'),
        {
          context: "new_password_fields_empty",
          metadata: {
            email,
            new_password_empty: !newPassword.trim(),
            confirm_password_empty: !confirmPassword.trim(),
          },
        },
      );
      return;
    }

    if (newPassword.length < 6) {
      await showFormError(
        logAndShowError,
        i18n.t('min6Characters'),
        {
          context: "new_password_too_short",
          metadata: { email, password_length: newPassword.length },
        },
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      await showFormError(logAndShowError, i18n.t('passwordsNotMatch'), {
        context: "new_password_mismatch",
        metadata: { email, passwords_match: false },
      });
      return;
    }

    const result = await updatePassword(newPassword);

    if (result.success) {
      setShowSuccess(true);
    } else {
      await showFormError(
        logAndShowError,
        result.error || i18n.t('updatePasswordError'),
        {
          context: "password_update_failed",
          metadata: { email, result_error: result.error },
        },
      );
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header con botón atrás y logo */}
      <BackButton
        onPress={() => navigation.navigate("Login")}
        disablePersonalization
      />

      {/* Header con logo */}
      <View
        style={[
          styles.header,
          isKeyboardVisible && styles.headerKeyboardVisible,
        ]}
      >
        <AppLogo
          width={isKeyboardVisible ? 120 : 200}
          height={isKeyboardVisible ? 120 : 200}
        />
      </View>

      {/* Título */}
      <Text
        style={[styles.title, isKeyboardVisible && styles.titleKeyboardVisible]}
      >
        {i18n.t('passwordSetupTitle')}
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Nueva Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{i18n.t('enterPasswordLabel')}</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('passwordLabel')}
                placeholderTextColor={colors.gray}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.inputIconButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Campo Confirmar Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{i18n.t('confirmPasswordLabel')}</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={i18n.t('confirmPasswordPlaceholder')}
                placeholderTextColor={colors.gray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.inputIconButton}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color={colors.black}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Botón Actualizar */}
      <View
        style={[
          styles.buttonContainer,
          isKeyboardVisible && styles.buttonContainerKeyboardVisible,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.updateButton,
            isUpdating && styles.updateButtonDisabled,
          ]}
          onPress={handleUpdatePassword}
          activeOpacity={0.8}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.updateButtonText}>{i18n.t('updatePasswordButton')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Alert de éxito */}
      <VerificationSuccessModal
        visible={showSuccess}
        title={i18n.t('passwordUpdatedTitle')}
        message={i18n.t('passwordUpdatedMessage')}
        onClose={handleCloseSuccess}
        gifType="verificado"
      />

      <VerificationErrorModal
        visible={showErrorModal}
        title={i18n.t('errorTitle')}
        message={errorMessage}
        onClose={closeErrorModal}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: "center",
    marginTop: -120,
  },
  headerKeyboardVisible: {
    marginTop: -80,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 30,
  },
  titleKeyboardVisible: {
    fontSize: 18,
  },
  form: {
    gap: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 18,
    color: colors.black,
    fontWeight: "500",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  inputIconButton: {
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100,
  },
  buttonContainerKeyboardVisible: {
    marginTop: -20,
  },
  updateButton: {
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewPasswordScreen;
