import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppLogo from "../../../../assets/image/AppLogo.svg";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "Onboarding"
>;

const OnboardingScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("UserType");
  };

  const handleSkip = () => {
    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <AppLogo width={300} height={300} />
      </View>

      {/* Título */}
      <Text style={styles.title}>
        {t('connectingPeople')}
      </Text>

      {/* Descripción */}
      <Text style={styles.description}>
        {t('discoverTuVoz')}
      </Text>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t('alreadyHaveAccount')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t('wantToRegister')}</Text>
        </TouchableOpacity>
      </View>

      {/* Omitir registro */}
      <TouchableOpacity
        onPress={handleSkip}
        style={styles.skipContainer}
        activeOpacity={0.6}
      >
        <Text style={styles.skipText}>{t('skipRegistration')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingBottom: 40,
    marginTop: -60,
  },
  logoContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.gray,
    textAlign: "center",
    marginBottom: 80,
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  buttonsContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  skipContainer: {
    alignItems: "center",
    marginTop: "auto",
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: colors.blue,
    fontWeight: "400",
  },
});

export default OnboardingScreen;
