import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import i18n from "@/src/app/i18n";
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
import { authService } from "../services/auth.Service";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ForgotPassword"
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSend = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      await logAndShowError(
        i18n.t('enterYourEmail'),
        new Error(i18n.t('enterYourEmail')),
        {
          context: "forgot_password_email_empty",
          metadata: { email_length: email.length },
        },
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      await logAndShowError(
        i18n.t('enterYourEmail'),
        new Error(i18n.t('enterYourEmail')),
        {
          context: "forgot_password_email_invalid",
          metadata: { email: normalizedEmail },
        },
      );
      return;
    }

    setLoading(true);

    try {
      const result = await authService.sendOTP(normalizedEmail, false);

      if (result.success) {
        navigation.navigate("RecoveryCode", { email: normalizedEmail });
      } else {
        await logAndShowError(
          result.error || i18n.t('somethingWentWrong'),
          new Error(
            result.error || i18n.t('somethingWentWrong'),
          ),
          {
            context: "forgot_password_otp_send_failed",
            metadata: { email: normalizedEmail, result_error: result.error },
          },
        );
      }
    } catch (error: unknown) {
      await logAndShowError(
        i18n.t('somethingWentWrong'),
        error instanceof Error ? error : undefined,
        {
          context: "forgot_password_unexpected_error",
          metadata: { email: normalizedEmail },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHelp = () => {
    navigation.navigate("LoginHelp");
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
        {i18n.t('forgotPassword')}
      </Text>

      {/* Subtítulo */}
      <Text
        style={[
          styles.subtitle,
          isKeyboardVisible && styles.subtitleKeyboardVisible,
        ]}
      >
        {i18n.t('recoverPassword')}
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{i18n.t('enterEmail')}</Text>
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
        </View>
      </View>

      {/* Botón Enviar */}
      <View
        style={[
          styles.buttonContainer,
          isKeyboardVisible && styles.buttonContainerKeyboardVisible,
        ]}
      >
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.sendButtonText}>{i18n.t('continue')}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Ayuda */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>{i18n.t('helpText')} </Text>
        <TouchableOpacity onPress={handleHelp} activeOpacity={0.7}>
          <Text style={styles.helpLink}>{i18n.t('help')}</Text>
        </TouchableOpacity>
      </View>

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
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 28,
  },
  titleKeyboardVisible: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.black,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  subtitleKeyboardVisible: {
    fontSize: 12,
    marginBottom: 20,
  },
  form: {
    gap: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  headerKeyboardVisible: {
    marginTop: -80,
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100,
  },
  buttonContainerKeyboardVisible: {
    marginTop: 40,
  },
  sendButton: {
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
  },
  helpText: {
    fontSize: 14,
    color: colors.black,
  },
  helpLink: {
    fontSize: 14,
    color: colors.lightBlue,
    fontWeight: "500",
  },
});

export default ForgotPasswordScreen;
