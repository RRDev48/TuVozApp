import ZenithXAnimado from "@/src/app/assets/icon/ZenithXAnimado.svg";
import TuvozLogo from "@/src/app/assets/image/tuvoz.svg";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { supportService } from "@/src/app/feature/ajustes/services/support.Service";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import SuccessModal from "@/src/app/feature/common/alerts/SuccessModal";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useMemo, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

type LoginSupportTicketNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "LoginSupportTicket"
>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginSupportTicketScreen = () => {
  const navigation = useNavigation<LoginSupportTicketNavigationProp>();

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const isFormValid = useMemo(() => {
    return (
      EMAIL_REGEX.test(email.trim()) &&
      subject.trim().length > 0 &&
      message.trim().length > 0
    );
  }, [email, subject, message]);

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const result = await supportService.createGuestTicket({
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      priority: "normal",
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(
        result.error || "No pudimos crear tu ticket. Intentalo nuevamente.",
      );
      setShowErrorModal(true);
      return;
    }

    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={[
            styles.logoContainer,
            isKeyboardVisible && styles.logoContainerKeyboardVisible,
          ]}
        >
          <View style={styles.logoSlot}>
            <TuvozLogo
              width={isKeyboardVisible ? 90 : 120}
              height={isKeyboardVisible ? 90 : 120}
            />
          </View>
          <View style={styles.dividerSlot}>
            <Text style={styles.logoDivider}>x</Text>
          </View>
          <View style={styles.logoSlot}>
            <ZenithXAnimado
              width={isKeyboardVisible ? 46 : 60}
              height={isKeyboardVisible ? 46 : 60}
            />
          </View>
        </View>

        <View
          style={[
            styles.headerContainer,
            isKeyboardVisible && styles.headerContainerKeyboardVisible,
          ]}
        >
          <Text
            style={[
              styles.title,
              isKeyboardVisible && styles.titleKeyboardVisible,
            ]}
          >
            Crear Ticket de Soporte
          </Text>
          <Text
            style={[
              styles.subtitle,
              isKeyboardVisible && styles.subtitleKeyboardVisible,
            ]}
          >
            Completa tus datos para que podamos ayudarte a recuperar el acceso.
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Correo electronico*</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="tucorreo@ejemplo.com"
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Asunto*</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Describe brevemente el problema"
              placeholderTextColor={colors.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Consulta*</Text>
            <TextInput
              style={styles.textArea}
              value={message}
              onChangeText={setMessage}
              placeholder="Cuéntanos qué sucede al iniciar sesión"
              placeholderTextColor={colors.gray}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View
          style={[
            styles.buttonContainer,
            isKeyboardVisible && styles.buttonContainerKeyboardVisible,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || isSubmitting) && styles.buttonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!isFormValid || isSubmitting}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Enviando..." : "Enviar ticket"}
            </Text>
          </TouchableOpacity>
        </View>

        <SuccessModal
          visible={showSuccessModal}
          title="Ticket enviado correctamente"
          onClose={handleSuccessClose}
        />

        <ErrorModal
          visible={showErrorModal}
          title="Error"
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainerKeyboardVisible: {
    marginTop: -12,
  },
  logoSlot: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerSlot: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logoDivider: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.darkBlue,
    textAlign: "center",
    marginTop: -6,
  },
  headerContainer: {
    paddingHorizontal: 4,
    paddingTop: 14,
    paddingBottom: 12,
    marginTop: -4,
    marginBottom: 12,
  },
  headerContainerKeyboardVisible: {
    paddingTop: 6,
    paddingBottom: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.darkBlue,
    marginBottom: 6,
    textAlign: "center",
  },
  titleKeyboardVisible: {
    fontSize: 21,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#314A71",
    textAlign: "center",
  },
  subtitleKeyboardVisible: {
    fontSize: 13,
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 8,
    gap: 14,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DBE5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    backgroundColor: "#F9FBFF",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#DBE5F5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.black,
    backgroundColor: "#F9FBFF",
    minHeight: 140,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 8,
  },
  buttonContainerKeyboardVisible: {
    paddingBottom: 16,
    paddingTop: 4,
  },
  button: {
    backgroundColor: colors.green,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoginSupportTicketScreen;
