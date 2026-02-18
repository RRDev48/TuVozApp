import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRegisterInfo } from "../(hooks)/useRegisterInfo";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";

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

  const { name, setName, isFormValid, validateForm } = useRegisterInfo({
    onValidationSuccess: ({ name }) => {
      navigation.navigate("EmailVerification", { name, role });
    },
  });

  const handleContinue = () => {
    validateForm();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header con botón atrás y logo */}
        <BackButton onPress={() => navigation.goBack()} />

        {/* Header con logo */}
        <View style={styles.header}>
          <AppLogo width={200} height={200} />
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
        </View>

        {/* Botón Continuar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
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

export default RegisterInfoScreen;
