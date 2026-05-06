import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import i18n from "@/src/app/i18n";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ProgressBar from "../components/ProgressBar";
import { ROLE_OPTIONS } from "../constants/roles";
import { useRoleSelection } from "../hooks/useRoleSelection";

type RoleSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "RoleSelection"
>;

const RoleSelectionScreen = () => {
  const navigation = useNavigation<RoleSelectionScreenNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamsList, "RoleSelection">>();

  const isOwner = route.params?.isOwner ?? true;

  const { selectedRole, handleRoleSelect, confirmSelection, isRoleSelected } =
    useRoleSelection({
      onRoleSelected: (roleId) => {
        navigation.navigate("RegisterInfo", { role: roleId, isOwner });
      },
    });

  const handleContinue = () => {
    confirmSelection();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con botón atrás y barra de progreso */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.backButtonWrapper}>
            <BackButton
              onPress={() => navigation.goBack()}
              disablePersonalization
            />
          </View>

          {/* Barra de progreso */}
          <ProgressBar currentStep={2} totalSteps={6} />
        </View>
      </View>

      {/* Título */}
      <Text style={styles.title}>{i18n.t('whatRoleDoYouHave')}</Text>

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
          <Text style={styles.continueButtonText}>{i18n.t('continueButton')}</Text>
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
  headerContainer: {
    marginTop: 20,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    paddingRight: 24,
  },
  backButtonWrapper: {
    marginLeft: -20,
    marginTop: -40,
    marginBottom: -10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 40,
    marginTop: 40,
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
