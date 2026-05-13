import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import usePreloadGifs from "@/src/app/contexts/usePreloadGifs";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { supabase } from "@/src/lib/supabaseClient";
import ZenithXAnimado from "../../../../assets/icon/ZenithXAnimado.svg";
import TuvozLogo from "../../../../assets/image/tuvoz.svg";

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "Splash"
>;

const SplashScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<SplashScreenNavigationProp>();
  usePreloadGifs();

  useEffect(() => {
    const checkUserAndNavigate = async () => {
      // Esperar un poco para mostrar el splash
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigation.replace("Home");
      } else {
        navigation.replace("Onboarding");
      }
    };

    checkUserAndNavigate();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo TUVOZ */}
        <View style={styles.logoContainer}>
          <TuvozLogo width={400} height={400} />
        </View>

        {/* Powered by section */}
        <View style={styles.poweredByContainer}>
          <Text style={styles.poweredByText}>{t('poweredBy')}</Text>
          {/* Icono ZenithX Animado */}
          <ZenithXAnimado width={60} height={60} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    bottom: 80,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  poweredByContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  poweredByText: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.black,
    marginBottom: 10,
  },
});

export default SplashScreen;
