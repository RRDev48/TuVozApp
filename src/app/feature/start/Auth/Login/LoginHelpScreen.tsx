import ZenithXAnimado from "@/src/app/assets/icon/ZenithXAnimado.svg";
import TuvozLogo from "@/src/app/assets/image/tuvoz.svg";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type LoginHelpNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "LoginHelp"
>;

const LoginHelpScreen = () => {
  const navigation = useNavigation<LoginHelpNavigationProp>();

  const steps = [
    {
      title: "Verifica tu correo",
      text: "Asegurate de escribir tu correo completo y sin espacios adicionales al inicio o al final.",
    },
    {
      title: "Revisa tu contrasena",
      text: "Comprueba mayusculas, minusculas y caracteres especiales. Puedes usar el icono del ojo para validarla.",
    },
    {
      title: "Recupera tu acceso",
      text: "Si olvidaste tu contrasena, usa la opcion 'Olvidaste tu contrasena?' para recibir instrucciones de recuperacion.",
    },
    {
      title: "Confirma tu conexion",
      text: "Una conexion inestable puede impedir el inicio de sesion. Intenta nuevamente con mejor senal.",
    },
    {
      title: "Contacta soporte",
      text: "Si el problema persiste, crea un ticket desde soporte para que podamos ayudarte a recuperar el acceso.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoSlot}>
          <TuvozLogo width={120} height={120} />
        </View>
        <View style={styles.dividerSlot}>
          <Text style={styles.logoDivider}>x</Text>
        </View>
        <View style={styles.logoSlot}>
          <ZenithXAnimado width={60} height={60} />
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Ayuda de Inicio de Sesion</Text>
        <Text style={styles.subtitle}>
          Sigue estos pasos para resolver los problemas mas comunes al ingresar.
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step, index) => (
          <View key={step.title} style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionNumberBubble}>
                <Text style={styles.sectionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>{step.title}</Text>
            </View>
            <Text style={styles.paragraph}>{step.text}</Text>
            {step.title === "Contacta soporte" ? (
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginSupportTicket")}
                activeOpacity={0.75}
                style={styles.supportButton}
              >
                <Text style={styles.supportButtonText}>Crear ticket ahora</Text>
              </TouchableOpacity>
            ) : null}
            {index < steps.length - 1 ? (
              <View style={styles.sectionDivider} />
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSlot: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerSlot: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logoDivider: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.darkBlue,
    textAlign: "center",
    marginTop: -6,
  },
  headerContainer: {
    paddingHorizontal: 4,
    paddingTop: 14,
    paddingBottom: 12,
    marginTop: -4,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.darkBlue,
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#314A71",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 4,
    paddingBottom: 4,
    gap: 0,
  },
  sectionBlock: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionNumberBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sectionNumberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.darkBlue,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#2D3F5D",
    paddingLeft: 40,
  },
  supportButton: {
    marginTop: 10,
    marginLeft: 40,
    alignSelf: "flex-start",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.green,
  },
  supportButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#DCE5F5",
    marginTop: 12,
    marginLeft: 40,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 8,
  },
  button: {
    backgroundColor: colors.lightBlue,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default LoginHelpScreen;
