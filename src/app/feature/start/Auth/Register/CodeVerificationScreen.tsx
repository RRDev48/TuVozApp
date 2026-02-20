import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../common/BackButton";
import VerificationErrorModal from "../components/VerificationErrorModal";
import VerificationSuccessModal from "../components/VerificationSuccessModal";
import { useCodeVerification } from "../hooks/useCodeVerification";
import { useOTPVerification } from "../hooks/useOTPVerification";

type CodeVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "CodeVerification"
>;

type CodeVerificationScreenRouteProp = RouteProp<
  RootStackParamsList,
  "CodeVerification"
>;

const CodeVerificationScreen = () => {
  const navigation = useNavigation<CodeVerificationScreenNavigationProp>();
  const route = useRoute<CodeVerificationScreenRouteProp>();
  const { email = "", name = "", role = "self" } = route.params || {};
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const {
    verifyCode,
    isVerifying,
    showErrorModal,
    closeErrorModal,
    errorMessage,
  } = useOTPVerification({
    email,
    onSuccess: () => setShowSuccessAlert(true),
    userData: { name, role },
  });

  const handleVerifyCode = async (fullCode: string) => {
    const success = await verifyCode(fullCode);
    if (!success) {
      resetCode();
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessAlert(false);
    // Navigate to Home after successful registration
    navigation.navigate("Login");
  };

  const { code, inputRefs, handleCodeChange, handleKeyPress, resetCode } =
    useCodeVerification({
      codeLength: 6,
      onComplete: handleVerifyCode,
    });

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false);
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      enabled
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header con botón atrás y logo */}
        <BackButton
          onPress={() => navigation.goBack()}
          disablePersonalization
        />

        {/* Header con logo */}
        <View style={styles.header}>
          <AppLogo width={200} height={200} />
        </View>

        {/* Icono de correo */}
        <View style={styles.iconContainer}>
          <Image
            source={require("../../../../assets/gif/llave.gif")}
            style={styles.mailIcon}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>
          Introduce tu código de{"\n"}verificación.
        </Text>

        {/* Descripción */}
        <Text style={styles.description}>
          Hemos enviado un código de 6 dígitos a{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* Campos de código */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={styles.codeInput}
              value={digit}
              onChangeText={(value) => handleCodeChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <VerificationErrorModal
          visible={showErrorModal}
          title="Error"
          message={errorMessage}
          onClose={closeErrorModal}
        />

        <VerificationSuccessModal
          visible={showSuccessAlert}
          title="Verificación exitosa"
          onClose={handleSuccessModalClose}
          gifType="llave"
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  mailIcon: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.blue,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  email: {
    fontWeight: "600",
    color: colors.blue,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: colors.blue,
    textAlign: "center",
    backgroundColor: colors.lightGray,
  },
});

export default CodeVerificationScreen;
