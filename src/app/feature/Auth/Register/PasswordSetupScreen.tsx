import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { usePasswordSetup } from "../(hooks)/usePasswordSetup";
import { authService } from "../(services)/authService";
import AppLogo from "../../../assets/image/AppLogo.svg";
import BackButton from "../../components/BackButton";

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

  const handleRegister = async (validPassword: string) => {
    // Crear usuario en Supabase - esto envía automáticamente el código de verificación
    const response = await authService.signUp(email, validPassword, {
      full_name: name,
      age: parseInt(age),
      role: role,
    });

    if (!response.success) {
      Alert.alert(
        "Error",
        response.error ||
          "No se pudo crear el usuario. Verifica que el correo no esté registrado.",
      );
      return;
    }

    // Navegar a CodeVerification - el código de verificación ya fue enviado
    navigation.navigate("CodeVerification", {
      email,
      password: validPassword,
      name,
      age,
      role,
    });
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    validatePasswords();
  };

  const handlePrivacyPolicy = () => {
    // TODO: Abrir política de privacidad
  };

  return (
    <View style={styles.container}>
      {/* Header con botón atrás y logo */}
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.headerLogoContainer}>
          <AppLogo width={250} height={250} />
        </View>

        <View style={styles.placeholder} />
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
      <TouchableOpacity
        style={[styles.continueButton, !isFormValid && styles.buttonDisabled]}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={!isFormValid}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>

      {/* Link Política de Privacidad */}
      <TouchableOpacity
        onPress={handlePrivacyPolicy}
        style={styles.privacyContainer}
        activeOpacity={0.7}
      >
        <Text style={styles.privacyText}>
          Política de Privacidad y Seguridad
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 60,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backText: {
    fontSize: 16,
    color: colors.black,
  },
  headerLogoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  placeholder: {
    width: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 28,
  },
  form: {
    gap: 20,
    marginBottom: 30,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: colors.black,
    fontWeight: "700",
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
    borderColor: "#FF3B30",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.white,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  privacyContainer: {
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
  },
  privacyText: {
    fontSize: 14,
    color: colors.lightBlue,
    fontWeight: "400",
  },
});

export default PasswordSetupScreen;
