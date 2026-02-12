import ErrorModal from "@/src/app/components/alerts/ErrorModal";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useErrorHandling } from "@/src/app/feature/ajustes/(hooks)/useErrorHandling";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { usePasswordSetup } from "../(hooks)/usePasswordSetup";
import { authService } from "../(services)/authService";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";

type PasswordSetupScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "PasswordSetup"
>;

type PasswordSetupScreenRouteProp = RouteProp<
  RootStackParamsList,
  "PasswordSetup"
>;

const PasswordSetupScreen = () => {
  const navigation = useNavigation<PasswordSetupScreenNavigationProp>();
  const route = useRoute<PasswordSetupScreenRouteProp>();
  const { email = "", name = "", age = "", role = "self" } = route.params || {};

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const handleRegister = async (validPassword: string) => {
    try {
      // Step 1: Create authentication user in Supabase Auth
      // Note: signUp automatically sends verification code and may auto-login depending on config
      const authResponse = await authService.signUp(email, validPassword);

      if (!authResponse.success || !authResponse.data?.user) {
        logAndShowError(
          authResponse.error ||
            "No se pudo crear el usuario. Verifica que el correo no esté registrado.",
          new Error(authResponse.error),
          {
            context: "auth_signup_failed",
            metadata: { email, step: "password_setup" },
          },
        );
        return;
      }

      // Step 2: Navigate to code verification (verification code already sent by signUp)
      // User and profile creation happens after OTP verification
      navigation.navigate("CodeVerification", {
        email,
        password: validPassword,
        name,
        age,
        role,
      });
    } catch (error: any) {
      logAndShowError(
        error.message || "Ocurrió un error durante el registro.",
        error,
        {
          context: "auth_registration_error",
          metadata: { email, step: "password_setup" },
        },
      );
    }
  };

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    showConfirmPassword,
    passwordError,
    confirmPasswordError,
    isFormValid,
    validatePasswords,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = usePasswordSetup({
    minLength: 8,
    onValidationSuccess: handleRegister,
  });

  const handleContinue = () => {
    validatePasswords();
  };

  const handlePrivacyPolicy = () => {
    // TODO: Abrir política de privacidad
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header con botón atrás y logo */}
        <BackButton onPress={() => navigation.goBack()} />

        {/* Header con logo */}
        <View style={styles.header}>
          <AppLogo width={200} height={200} />
        </View>

        {/* Título */}
        <Text style={styles.title}>
          Para continuar, necesitamos{"\n"}una contraseña segura.
        </Text>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingresa tu Contraseña*</Text>
            <View
              style={[
                styles.inputContainer,
                passwordError ? styles.inputContainerError : null,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Mínimo 8 caracteres"
                placeholderTextColor={colors.white}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Campo Confirmar Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repite tu Contraseña*</Text>
            <View
              style={[
                styles.inputContainer,
                confirmPasswordError ? styles.inputContainerError : null,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Confirma tu contraseña"
                placeholderTextColor={colors.white}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={toggleConfirmPasswordVisibility}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>
        </View>

        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>

        {/* Link Términos y Condiciones */}
        <TouchableOpacity
          onPress={handlePrivacyPolicy}
          style={styles.termsContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.termsText}>Términos y Condiciones</Text>
        </TouchableOpacity>

        <ErrorModal
          visible={showErrorModal}
          title="Error"
          message={errorMessage}
          onClose={closeErrorModal}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: "center",
    marginTop: -60,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 30,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputContainerError: {
    borderWidth: 2,
    borderColor: colors.red,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: 4,
    marginLeft: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100,
  },
  continueButton: {
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  termsContainer: {
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
  },
  termsText: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: "400",
  },
});

export default PasswordSetupScreen;
