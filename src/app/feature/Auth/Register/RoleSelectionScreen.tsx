import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
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
import AppLogo from "../../../assets/image/AppLogo.svg";

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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    confirmSelection();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
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
      <TouchableOpacity
        style={[
          styles.continueButton,
          !isRoleSelected && styles.buttonDisabled,
        ]}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={!selectedRole}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
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
    marginBottom: 40,
  },
  rolesContainer: {
    gap: 16,
    marginBottom: 40,
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
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: "auto",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default RoleSelectionScreen;
