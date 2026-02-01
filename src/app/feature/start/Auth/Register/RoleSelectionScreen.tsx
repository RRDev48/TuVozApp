import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ROLE_OPTIONS } from "../(constants)/roles";
import { useRoleSelection } from "../(hooks)/useRoleSelection";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";

type RoleSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "RoleSelection"
>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();

  const { selectedRole, handleRoleSelect, confirmSelection, isRoleSelected } =
    useRoleSelection({
      onRoleSelected: (roleId) => {
        navigation.navigate("RegisterInfo", { role: roleId });
      },
    });

  const handleContinue = () => {
    confirmSelection();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con botón atrás y logo */}
      <BackButton onPress={() => navigation.goBack()} />

      {/* Header con logo */}
      <View style={styles.header}>
        <AppLogo width={200} height={200} />
      </View>

      {/* Título */}
      <Text style={styles.title}>Que rol Cumplis?</Text>

      {/* Opciones de rol */}
      <View style={styles.rolesContainer}>
        {ROLE_OPTIONS.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleButton,
              selectedRole === role.id && styles.roleButtonSelected,
            ]}
            onPress={() => handleRoleSelect(role.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.roleText}>{role.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón Continuar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !isRoleSelected && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!isRoleSelected}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  rolesContainer: {
    gap: 16,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  roleButton: {
    backgroundColor: colors.blue,
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: "center",
  },
  roleButtonSelected: {
    backgroundColor: "#3A4A6A",
    borderWidth: 2,
    borderColor: colors.lightBlue,
  },
  roleText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 100,
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
});

export default RoleSelectionScreen;
