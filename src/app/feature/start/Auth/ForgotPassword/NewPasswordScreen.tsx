import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { usePasswordRecovery } from "../(hooks)/usePasswordRecovery";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";
import SuccessAlert from "./components/SuccessAlert";

type NewPasswordScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "NewPassword"
>;

type NewPasswordScreenRouteProp = RouteProp<RootStackParamsList, "NewPassword">;

const NewPasswordScreen = () => {
  const navigation = useNavigation<NewPasswordScreenNavigationProp>();
  const route = useRoute<NewPasswordScreenRouteProp>();
  const { email = "" } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { updatePassword, isUpdating } = usePasswordRecovery();

  const handleUpdatePassword = async () => {
    // Validaciones
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    // Actualizar contraseña
    const result = await updatePassword(newPassword);

    if (result.success) {
      setShowSuccess(true);
    } else {
      Alert.alert(
        "Error",
        result.error || "No se pudo actualizar la contraseña",
      );
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Navegar a login
    navigation.navigate("Login");
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
      <Text style={styles.title}>Nueva contraseña</Text>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>
        Crea tu nueva contraseña para acceder a tu cuenta
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Nueva Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nueva contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Contraseña*"
              placeholderTextColor={colors.white}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.inputIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Campo Confirmar Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña*"
              placeholderTextColor={colors.white}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.inputIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botón Actualizar */}
      <TouchableOpacity
        style={[styles.updateButton, isUpdating && styles.updateButtonDisabled]}
        onPress={handleUpdatePassword}
        activeOpacity={0.8}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.updateButtonText}>Actualizar contraseña</Text>
        )}
      </TouchableOpacity>

      {/* Alert de éxito */}
      <SuccessAlert
        visible={showSuccess}
        title="Contraseña actualizada"
        onClose={handleCloseSuccess}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLogoContainer: {
    alignItems: "center",
    marginTop: -100,
  },
  placeholder: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.blue,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  form: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 30,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.blue,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
  },
  inputIcon: {
    marginLeft: 8,
    padding: 4,
  },
  updateButton: {
    backgroundColor: colors.blue,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
});

export default NewPasswordScreen;
