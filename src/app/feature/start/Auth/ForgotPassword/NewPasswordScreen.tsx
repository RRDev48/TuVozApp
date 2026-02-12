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
      <BackButton onPress={() => navigation.goBack()} />

      {/* Header con logo */}
      <View style={styles.header}>
        <AppLogo width={200} height={200} />
      </View>

      {/* Título */}
      <Text style={styles.title}>
        Para continuar, necesitamos{"\n"}una contraseña segura.
      </Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Nueva Contraseña */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ingresa tu Contraseña*</Text>
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
          <Text style={styles.label}>Confirmar Contraseña*</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.updateButton,
            isUpdating && styles.updateButtonDisabled,
          ]}
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
      </View>

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
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.white,
    fontWeight: "500",
  },
  inputIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100,
  },
  updateButton: {
    backgroundColor: colors.green,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  updateButtonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NewPasswordScreen;
