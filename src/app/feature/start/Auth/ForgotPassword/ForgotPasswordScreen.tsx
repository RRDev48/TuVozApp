import ErrorModal from "@/src/app/components/alerts/ErrorModal";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../(services)/authService";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ForgotPassword"
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSend = async () => {
    if (!email.trim()) {
      setErrorMessage("Por favor ingresa tu correo electrónico");
      setShowErrorModal(true);
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor ingresa un correo electrónico válido");
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    try {
      // Enviar OTP para recuperación de contraseña
      const result = await authService.sendOTP(email, false);

      if (result.success) {
        // Navegar a la pantalla de verificación de código
        navigation.navigate("RecoveryCode", { email });
      } else {
        setErrorMessage(
          result.error || "No se pudo enviar el código de verificación",
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error inesperado");
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleHelp = () => {
    // TODO: Navegar a pantalla de ayuda
  };

  return (
    <View style={styles.container}>
      {/* Header con botón atrás y logo */}
      <BackButton onPress={() => navigation.goBack()} />

      {/* Header con logo */}
      <View style={styles.header}>
        <AppLogo width={200} height={200} />
      </View>

      {/* Título */}
      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Rellena tus datos para recuperar tu contraseña
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Como es tu correo electronico?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email*"
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
        </View>
      </View>

      {/* Botón Enviar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={handleSend}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.sendButtonText}>Enviar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Ayuda */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>¿Problemas para iniciar sesion? </Text>
        <TouchableOpacity onPress={handleHelp} activeOpacity={0.7}>
          <Text style={styles.helpLink}>Ayuda</Text>
        </TouchableOpacity>
      </View>

      <ErrorModal
        visible={showErrorModal}
        title="Error"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </View>
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
    marginBottom: 15,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.black,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  form: {
    gap: 20,
    marginBottom: 30,
    paddingHorizontal: 20,
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100,
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
