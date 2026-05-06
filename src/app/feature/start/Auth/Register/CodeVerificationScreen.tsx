import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import OptimizedGif from "../../../common/OptimizedGif";
import BackButton from "../../../common/BackButton";
import ProgressBar from "../components/ProgressBar";
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
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<CodeVerificationScreenNavigationProp>();
  const route = useRoute<CodeVerificationScreenRouteProp>();
  const {
    email = "",
    name = "",
    role = "self",
    isOwner = true,
    ownerUserId,
  } = route.params || {};
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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

  const isSelfFlow = role === "self";
  const currentStep = isSelfFlow ? 5 : 6;
  const totalSteps = isSelfFlow ? 5 : 6;

  const { verifyCode, showErrorModal, closeErrorModal, errorMessage } =
    useOTPVerification({
      email,
      onSuccess: () => setShowSuccessAlert(true),
      userData: { name, role, isOwner, ownerUserId },
    });

  const handleVerifyCode = async (fullCode: string) => {
    const success = await verifyCode(fullCode);
    if (!success) {
      resetCode();
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessAlert(false);
    navigation.navigate("Login");
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
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </View>
        </View>

        {/* Icono de correo */}
        {!isKeyboardVisible && (
          <View style={styles.iconContainer}>
            <OptimizedGif
              source={require("../../../../assets/gif/llave.gif")}
              style={styles.mailIcon}
            />
          </View>
        )}

        {/* Título */}
        <Text
          style={[
            styles.title,
            isKeyboardVisible && styles.titleKeyboardVisible,
          ]}
        >
          {t("verificationTitle")}
        </Text>

        {/* Descripción */}
        <Text
          style={[
            styles.description,
            isKeyboardVisible && styles.descriptionKeyboardVisible,
          ]}
        >
          {t("verificationDescription")}{"\n"}
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
          title={t("errorTitle")}
          message={errorMessage}
          onClose={closeErrorModal}
        />

        <VerificationSuccessModal
          visible={showSuccessAlert}
          title={t("verificationSuccessTitle")}
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
  header: {
    alignItems: "center",
    marginTop: -60,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
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
  titleKeyboardVisible: {
    fontSize: 18,
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  descriptionKeyboardVisible: {
    fontSize: 12,
    marginBottom: 20,
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
