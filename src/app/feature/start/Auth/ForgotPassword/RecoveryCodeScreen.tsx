import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useCodeVerification } from "../(hooks)/useCodeVerification";
import { usePasswordRecovery } from "../(hooks)/usePasswordRecovery";
import AppLogo from "../../../../assets/image/AppLogo.svg";
import BackButton from "../../../components/BackButton";

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

  const { verifyRecoveryCode } = usePasswordRecovery();

  const handleVerifyCode = async (fullCode: string) => {
    const result = await verifyRecoveryCode(email, fullCode);

    if (result.success) {
      // Navegar a la pantalla de nueva contraseña
      navigation.navigate("NewPassword", { email });
    } else {
      Alert.alert("Error", result.error || "Código de verificación incorrecto");
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
        <BackButton onPress={() => navigation.goBack()} />

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
    color: colors.black,
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: colors.black,
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
    backgroundColor: colors.white,
  },
});

export default RecoveryCodeScreen;
