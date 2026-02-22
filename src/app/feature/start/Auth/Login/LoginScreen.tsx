import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
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
import { authService } from "../services/auth.Service";

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

  const handleContinue = async () => {
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
        navigation.navigate("Home");
      } else {
        setEmailError("Credenciales incorrectas");
        setPasswordError("Credenciales incorrectas");
      }
    } catch (error) {
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header con botón atrás y logo */}
        <BackButton
          onPress={() => navigation.navigate("Onboarding")}
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
          style={[
            styles.title,
            isKeyboardVisible && styles.titleKeyboardVisible,
          ]}
        >
          Completa tus datos para{"\n"}iniciar sesión
        </Text>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Campo Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Como es tu correo electronico?</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Email*"
                  placeholderTextColor={colors.gray}
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

          {/* Campo Contraseña */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Y tu contraseña?</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña*"
                  placeholderTextColor={colors.gray}
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
                    size={24}
                    color={colors.black}
                  />
                </TouchableOpacity>
              </View>
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
        <View
          style={[
            styles.buttonContainer,
            isKeyboardVisible && styles.buttonContainerKeyboardVisible,
          ]}
        >
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
        </View>

        {/* Ayuda */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>¿Problemas para iniciar sesion? </Text>
          <TouchableOpacity onPress={handleHelp} activeOpacity={0.7}>
            <Text style={styles.helpLink}>Ayuda</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: -120,
  },
  headerKeyboardVisible: {
    marginTop: -80,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 30,
  },
  titleKeyboardVisible: {
    fontSize: 18,
    marginTop: -20,
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
  inputIconButton: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.red,
    marginTop: -27,
    marginLeft: 10,
  },
  forgotPasswordContainer: {
    alignItems: "center",
    marginTop: -15,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.lightBlue,
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 80,
  },
  buttonContainerKeyboardVisible: {
    marginTop: -20,
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

export default LoginScreen;
