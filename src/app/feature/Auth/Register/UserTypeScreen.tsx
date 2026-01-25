import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { RootStackParamsList } from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppLogo from "../../../assets/image/AppLogo.svg";

type UserTypeScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "UserType"
>;

type UserTypeOption = "self" | "other" | null;

const UserTypeScreen = () => {
  const navigation = useNavigation<UserTypeScreenNavigationProp>();
  const [selectedType, setSelectedType] = useState<UserTypeOption>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    if (!selectedType) {
      return;
    }
    if (selectedType === "self") {
      navigation.navigate("RegisterInfo", { role: "self" });
    } else {
      navigation.navigate("RoleSelection");
    }
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
      <Text style={styles.title}>Para quien configuras{"\n"}TuVoz?</Text>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        {/* Para mi */}
        <View style={styles.optionWrapper}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === "self" && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedType("self")}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Image
                source={require("../../../assets/gif/parami.gif")}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.optionText}>Para mi</Text>
        </View>

        {/* Para otro */}
        <View style={styles.optionWrapper}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === "other" && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedType("other")}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Image
                source={require("../../../assets/gif/paraotro.gif")}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.optionText}>Para otro</Text>
        </View>
      </View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={[styles.continueButton, !selectedType && styles.buttonDisabled]}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={!selectedType}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>
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
    color: colors.black,
    textAlign: "center",
    marginBottom: 50,
    lineHeight: 28,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 50,
  },
  optionWrapper: {
    alignItems: "center",
    gap: 10,
  },
  optionCard: {
    width: 140,
    height: 140,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  optionCardSelected: {
    backgroundColor: colors.white,
    borderWidth: 5,
    borderColor: colors.lightBlue,
  },
  iconContainer: {
    width: 80,
    height: 80,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 80,
    height: 80,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: colors.blue,
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

export default UserTypeScreen;
