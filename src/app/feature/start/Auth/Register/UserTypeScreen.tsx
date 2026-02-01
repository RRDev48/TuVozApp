import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";

type UserTypeScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "UserType"
>;

type UserTypeOption = "self" | "other" | null;

const UserTypeScreen = () => {
  const navigation = useNavigation<UserTypeScreenNavigationProp>();
  const [selectedType, setSelectedType] = useState<UserTypeOption>(null);

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
      <BackButton onPress={() => navigation.goBack()} />

      {/* Header con logo */}
      <View style={styles.header}>
        <AppLogo width={200} height={200} />
      </View>

      {/* Título */}
      <Text style={styles.title}>Para quien configuras TuVoz?</Text>

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
                source={require("../../../../assets/icon/parami.png")}
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
                source={require("../../../../assets/icon/paraotro.png")}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.optionText}>Para otro</Text>
        </View>
      </View>

      {/* Botón Continuar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedType && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!selectedType}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
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
    borderColor: colors.green,
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
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 100,
    gap: 16,
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

export default UserTypeScreen;
