import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { RootStackParamsList } from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../(services)/authService";
import AppLogo from "../../../assets/image/AppLogo.svg";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "Login"
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = async () => {
    // Limpiar errores previos
    setEmailError("");
    setPasswordError("");

    if (!email.trim() || !password.trim()) {
      if (!email.trim()) setEmailError("Por favor ingresa tu email");
      if (!password.trim()) setPasswordError("Por favor ingresa tu contraseña");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signIn(email, password);

      if (response.success) {
        // Navegar al Home después de login exitoso
        navigation.navigate("Home");
      } else {
        // Marcar ambos campos como error cuando las credenciales son incorrectas
        setEmailError("Credenciales incorrectas");
        setPasswordError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Login error:", error);
      setEmailError("Error al iniciar sesión");
      setPasswordError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleHelp = () => {
    // TODO: Navegar a pantalla de ayuda
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
        Completa tus datos para{"\n"}iniciar sesión
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Como es tu correo electronico?</Text>
          <View
            style={[
              styles.inputContainer,
              emailError ? styles.inputContainerError : null,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Email*"
              placeholderTextColor={colors.white}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
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

        {/* Campo Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Y tu contraseña?</Text>
          <View
            style={[
              styles.inputContainer,
              passwordError ? styles.inputContainerError : null,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Contraseña*"
              placeholderTextColor={colors.white}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.inputIconButton}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        {/* Link olvidaste contraseña */}
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={[styles.continueButton, isLoading && styles.buttonDisabled]}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Text style={styles.continueButtonText}>
          {isLoading ? "Iniciando sesión..." : "Continuar"}
        </Text>
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
  inputIconButton: {
    marginLeft: 10,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
    marginLeft: 10,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.lightBlue,
    fontWeight: "400",
  },
  continueButton: {
    backgroundColor: colors.blue,
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

export default LoginScreen;
