import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { RootStackParamsList } from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useEmailValidation } from "../(hooks)/useEmailValidation";
import AppLogo from "../../../assets/image/AppLogo.svg";

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
  const { name = "", age = "", role = "self" } = route.params || {};

  const {
    email,
    setEmail,
    confirmEmail,
    setConfirmEmail,
    emailError,
    confirmEmailError,
    isFormValid,
    validateEmails,
  } = useEmailValidation({
    onValidationSuccess: (validatedEmail) => {
      console.log("Skipping OTP send (development mode), navigating directly");
      // TODO: Descomentar cuando configures SMTP en Supabase
      // const response = await authService.sendOTP(email);
      // if (!response.success) {
      //   Alert.alert("Error", response.error || "No se pudo enviar el código");
      //   return;
      // }
      navigation.navigate("CodeVerification", {
        email: validatedEmail,
        name,
        age,
        role,
      });
    },
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    console.log("handleContinue called");
    validateEmails();
  };

  const handlePrivacyPolicy = () => {
    // TODO: Abrir política de privacidad
    console.log("Open privacy policy");
  };

  return (
    <View style={styles.container}>
      {/* Header con botón atrás y logo */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={colors.black} />
          <Text style={styles.backText}>Atrás</Text>
        </TouchableOpacity>

        <View style={styles.headerLogoContainer}>
          <AppLogo width={250} height={250} />
        </View>

        <View style={styles.placeholder} />
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
  inputIcon: {
    marginLeft: 10,
    color: colors.white,
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

export default EmailVerificationScreen;
