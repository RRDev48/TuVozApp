import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { RootStackParamsList } from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useRegisterInfo } from "../(hooks)/useRegisterInfo";
import AppLogo from "../../../assets/image/AppLogo.svg";

type RegisterInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "RegisterInfo"
>;

type RegisterInfoScreenRouteProp = RouteProp<
  RootStackParamsList,
  "RegisterInfo"
>;

const RegisterInfoScreen = () => {
  const navigation = useNavigation<RegisterInfoScreenNavigationProp>();
  const route = useRoute<RegisterInfoScreenRouteProp>();
  const role = route.params?.role || "self";

  const { name, setName, age, setAge, isFormValid, validateForm } =
    useRegisterInfo({
      onValidationSuccess: ({ name, age }) => {
        navigation.navigate("EmailVerification", { name, age, role });
      },
    });

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    validateForm();
  };

  const handlePrivacyPolicy = () => {
    // TODO: Abrir política de privacidad
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
      <Text style={styles.title}>Comencemos a conocernos{"\n"}un poco!!</Text>

      {/* Formulario */}
      <View style={styles.form}>
        {/* Campo Nombre */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Como quieres que te llamemos?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre*"
              placeholderTextColor={colors.white}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>
        </View>

        {/* Campo Edad */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cuantos años tienes?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Edad*"
              placeholderTextColor={colors.white}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>
      </View>

      {/* Botón Continuar */}
      <TouchableOpacity
        style={[styles.continueButton, !isFormValid && styles.buttonDisabled]}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={!isFormValid}
      >
        <Text style={styles.continueButtonText}>Continuar</Text>
      </TouchableOpacity>

      {/* Link Política de Privacidad */}
      <TouchableOpacity
        onPress={handlePrivacyPolicy}
        style={styles.privacyContainer}
        activeOpacity={0.7}
      >
        <Text style={styles.privacyText}>
          Política de Privacidad y Seguridad
        </Text>
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
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.white,
    fontWeight: "500",
  },
  continueButton: {
    backgroundColor: "#4CAF50",
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
  privacyContainer: {
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
  },
  privacyText: {
    fontSize: 14,
    color: colors.lightBlue,
    fontWeight: "400",
  },
});

export default RegisterInfoScreen;
