import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { RootStackParamsList } from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCodeVerification } from "../(hooks)/useCodeVerification";
import { authService } from "../(services)/authService";
import AppLogo from "../../../assets/image/AppLogo.svg";

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
  const { email = "", name = "", age = "", role = "self" } = route.params || {};

  const verifyCode = async (fullCode: string) => {
    if (fullCode.length !== 6) {
      Alert.alert("Error", "Por favor ingresa el código de 6 dígitos completo");
      return;
    }

    setIsVerifying(true);

    try {
      // TEMPORAL: Aceptar 111111 hasta configurar SMTP
      if (fullCode === "111111") {
        console.log("Using temporary code 111111");
        navigation.navigate("PasswordSetup", { email, name, age, role });
        return;
      }

      // Verificar el código OTP con Supabase
      const response = await authService.verifyOTP(email, fullCode);

      if (response.error) {
        Alert.alert("Error", "Código de verificación incorrecto");
        resetCode();
      } else {
        // Navegar a la pantalla de contraseña
        navigation.navigate("PasswordSetup", { email, name, age, role });
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al verificar el código");
      console.error("Verification error:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  const {
    code,
    inputRefs,
    isVerifying,
    setIsVerifying,
    handleCodeChange,
    handleKeyPress,
    resetCode,
  } = useCodeVerification({
    codeLength: 6,
    onComplete: verifyCode,
  });

  const handleBack = () => {
    navigation.goBack();
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

      {/* Icono de correo */}
      <View style={styles.iconContainer}>
        <Image
          source={require("../../../assets/gif/llave.gif")}
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
    color: "#000000",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  email: {
    fontWeight: "600",
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 60,
    backgroundColor: colors.blue,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
  },
});

export default CodeVerificationScreen;
