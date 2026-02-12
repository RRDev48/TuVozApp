import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
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

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Por favor ingresa un correo electrónico válido");
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
        Alert.alert(
          "Error",
          result.error || "No se pudo enviar el código de verificación",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error inesperado");
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
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />

        <View style={styles.headerLogoContainer}>
          <AppLogo width={250} height={250} />
        </View>

        <View style={styles.placeholder} />
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

      {/* Ayuda */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>¿Problemas para iniciar sesion? </Text>
        <TouchableOpacity onPress={handleHelp} activeOpacity={0.7}>
          <Text style={styles.helpLink}>Ayuda</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 15,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
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
  sendButton: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  helpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
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
