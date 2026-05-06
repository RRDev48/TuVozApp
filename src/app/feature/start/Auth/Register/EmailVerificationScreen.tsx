import { colors } from "@/src/app/design-system/themes/globalColors-theme";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ProgressBar from "../components/ProgressBar";
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
  const {
    name = "",
    role = "self",
    isOwner = true,
    ownerUserId,
  } = route.params || {};
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

  const isSelfFlow = role === "self";
  const currentStep = isSelfFlow ? 3 : 4;
  const totalSteps = isSelfFlow ? 5 : 6;

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
        isOwner,
        ownerUserId,
      });
    },
  });

  const handleContinue = async () => {
    await validateEmails();
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("TermsAndConditions");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header con botón atrás y barra de progreso */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View style={styles.backButtonWrapper}>
              <BackButton
                onPress={() => navigation.goBack()}
                disablePersonalization
              />
            </View>

            {/* Barra de progreso */}
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </View>
        </View>

        {/* Título */}
        <Text
          style={[
            styles.title,
            isKeyboardVisible && styles.titleKeyboardVisible,
          ]}
        >
          {i18n.t('emailVerificationTitle')}
        </Text>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Campo Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('enterYourEmailLabel')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t('emailField')}
                  placeholderTextColor={colors.gray}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={colors.black}
                  style={styles.inputIcon}
                />
              </View>
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Campo Confirmar Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{i18n.t('repeatYourEmailLabel')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t('emailField')}
                  placeholderTextColor={colors.gray}
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color={colors.black}
                  style={styles.inputIcon}
                />
              </View>
            </View>
            {confirmEmailError ? (
              <Text style={styles.errorText}>{confirmEmailError}</Text>
            ) : null}
          </View>
        </View>

        {/* Botón Continuar */}
        <View
          style={[
            styles.buttonContainer,
            isKeyboardVisible && styles.buttonContainerKeyboardVisible,
          ]}
        >
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
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.continueButtonText}>{i18n.t('continueButton')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Link Términos y Condiciones */}
        <TouchableOpacity
          onPress={handlePrivacyPolicy}
          style={styles.termsContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.termsText}>{i18n.t('termsAndConditionsLink')}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    paddingRight: 24,
  },
  backButtonWrapper: {
    marginLeft: -20,
    marginTop: -40,
    marginBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  titleKeyboardVisible: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
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
  inputIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: -20,
    marginLeft: 10,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  buttonContainerKeyboardVisible: {
    flex: 0,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: colors.green,
    paddingVertical: 18,
    borderRadius: 30,
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
