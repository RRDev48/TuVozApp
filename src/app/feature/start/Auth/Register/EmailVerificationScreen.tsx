import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../common/BackButton";
import { useEmailValidation } from "../hooks/useEmailValidation";

type EmailVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "EmailVerification"
>;

type EmailVerificationScreenRouteProp = RouteProp<
  RootStackParamsList,
  "EmailVerification"
>;

const EmailVerificationScreen = () => {
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const route = useRoute<EmailVerificationScreenRouteProp>();
  const { name = "", role = "self" } = route.params || {};

  const {
    email,
    setEmail,
    confirmEmail,
    setConfirmEmail,
    emailError,
    confirmEmailError,
    isFormValid,
    validateEmails,
    isChecking,
  } = useEmailValidation({
    onValidationSuccess: (validatedEmail) => {
      navigation.navigate("PasswordSetup", {
        email: validatedEmail,
        name,
        role,
      });
    },
  });

  const handleContinue = async () => {
    await validateEmails();
  };

  const handlePrivacyPolicy = () => {
    // TODO: Abrir política de privacidad
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header con botón atrás y logo */}
        <BackButton
          onPress={() => navigation.goBack()}
          disablePersonalization
        />

        {/* Header con logo */}
        <View style={styles.header}>
          <AppLogo width={200} height={200} />
        </View>

        {/* Título */}
        <Text style={styles.title}>
          Para continuar, necesitamos{"\n"}un correo electrónico válido.
        </Text>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Campo Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingresa tu Email*</Text>
            <View
              style={[
                styles.inputContainer,
                emailError ? styles.inputContainerError : null,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="micorreo64@gmail.com"
                placeholderTextColor={colors.white}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.white}
                style={styles.inputIcon}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Campo Confirmar Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Repite tu Email*</Text>
            <View
              style={[
                styles.inputContainer,
                confirmEmailError ? styles.inputContainerError : null,
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="micorreo64@gmail.com"
                placeholderTextColor={colors.white}
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.white}
                style={styles.inputIcon}
              />
            </View>
            {confirmEmailError ? (
              <Text style={styles.errorText}>{confirmEmailError}</Text>
            ) : null}
          </View>
        </View>

        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!isFormValid || isChecking) && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isFormValid || isChecking}
          >
            {isChecking ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={styles.continueButtonText}>Continuar</Text>
            )}
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
  inputIcon: {
    marginLeft: 10,
    color: colors.white,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: -5,
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

export default EmailVerificationScreen;
