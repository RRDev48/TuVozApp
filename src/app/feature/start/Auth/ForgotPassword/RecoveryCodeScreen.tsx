import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useErrorHandling } from "@/src/app/feature/ajustes/hooks/useErrorHandling";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
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
import { useCodeVerification } from "../hooks/useCodeVerification";
import { usePasswordRecovery } from "../hooks/usePasswordRecovery";

type RecoveryCodeScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "RecoveryCode"
>;

type RecoveryCodeScreenRouteProp = RouteProp<
  RootStackParamsList,
  "RecoveryCode"
>;

const RecoveryCodeScreen = () => {
  const navigation = useNavigation<RecoveryCodeScreenNavigationProp>();
  const route = useRoute<RecoveryCodeScreenRouteProp>();
  const { email = "" } = route.params || {};
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const { showErrorModal, errorMessage, logAndShowError, closeErrorModal } =
    useErrorHandling();

  const { verifyRecoveryCode } = usePasswordRecovery();

  const handleVerifyCode = async (fullCode: string) => {
    const result = await verifyRecoveryCode(email, fullCode);

    if (result.success) {
      navigation.navigate("NewPassword", { email });
    } else {
      logAndShowError(
        result.error || "Código de verificación incorrecto",
        new Error(result.error || "Código de verificación incorrecto"),
        {
          context: "recovery_code_verification_failed",
          metadata: { email },
        },
      );
      resetCode();
    }
  };

  const { code, inputRefs, handleCodeChange, handleKeyPress, resetCode } =
    useCodeVerification({
      codeLength: 6,
      onComplete: handleVerifyCode,
    });

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
          onPress={() => navigation.navigate("Login")}
          disablePersonalization
        />

        {/* Header con logo */}
        <View
          style={[
            styles.header,
            isKeyboardVisible && styles.headerKeyboardVisible,
          ]}
        >
          <AppLogo
            width={isKeyboardVisible ? 120 : 200}
            height={isKeyboardVisible ? 120 : 200}
          />
        </View>

        {/* Icono de correo */}
        <View
          style={[
            styles.iconContainer,
            isKeyboardVisible && styles.iconContainerKeyboardVisible,
          ]}
        >
          <Image
            source={require("../../../../assets/gif/llave.gif")}
            style={[
              styles.mailIcon,
              isKeyboardVisible && styles.mailIconKeyboardVisible,
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text
          style={[
            styles.title,
            isKeyboardVisible && styles.titleKeyboardVisible,
          ]}
        >
          Introduce tu código de{"\n"}verificación.
        </Text>

        {/* Descripción */}
        <Text
          style={[
            styles.description,
            isKeyboardVisible && styles.descriptionKeyboardVisible,
          ]}
        >
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
    marginTop: -120,
  },
  headerKeyboardVisible: {
    marginTop: -80,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainerKeyboardVisible: {
    marginBottom: 15,
  },
  mailIcon: {
    width: 180,
    height: 180,
  },
  mailIconKeyboardVisible: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 28,
  },
  titleKeyboardVisible: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.black,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  descriptionKeyboardVisible: {
    fontSize: 13,
    marginBottom: 30,
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
    backgroundColor: colors.white,
  },
});

export default RecoveryCodeScreen;
