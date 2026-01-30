import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useUserData } from "@/src/app/feature/Home/(hooks)/useUserData";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useCurrentUser } from "../../(hooks)/useCurrentUser";

const SettingsScreen = () => {
  const { userName } = useUserData();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const { currentUser, isLoading } = useCurrentUser();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateToProfiles = useCallback(() => {
    navigation.navigate("ProfilesConfigScreen");
  }, [navigation]);

  const handleNavigateToPersonalization = useCallback(() => {
    navigation.navigate("PersonalizationScreen");
  }, [navigation]);

  const handleNavigateToSupport = useCallback(() => {
    navigation.navigate("SupportScreen");
  }, [navigation]);

  const handleNavigateToEmergency = useCallback(() => {
    navigation.navigate("Emergencias");
  }, [navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 60,
          paddingBottom: 10,
        },
        backButton: {
          flexDirection: "row",
          alignItems: "center",
        },
        backText: {
          fontSize: 16,
          fontWeight: "600",
          color: themedColors.text,
          marginLeft: 4,
        },
        titleContainer: {
          paddingHorizontal: 20,
          paddingBottom: 20,
          alignItems: "center",
        },
        headerTitle: {
          fontSize: 30,
          fontWeight: "bold",
          textAlign: "center",
          color: themedColors.primary,
        },
        avatarContainer: {
          alignItems: "center",
          marginBottom: 40,
        },
        avatarCircle: {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: themedColors.primary,
          justifyContent: "center",
          alignItems: "center",
        },
        avatarImage: {
          width: 80,
          height: 80,
        },
        greetingText: {
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 40,
          color: themedColors.text,
        },
        buttonsContainer: {
          paddingHorizontal: 20,
          gap: 16,
        },
        button: {
          backgroundColor: themedColors.cardBackground,
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
        },
        buttonIcon: {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        },
        buttonTextContainer: {
          flex: 1,
        },
        buttonTitle: {
          color: themedColors.background,
          fontSize: 18,
          fontWeight: "700",
        },
        buttonSubtitle: {
          color: themedColors.background,
          fontSize: 14,
          opacity: 0.8,
          marginTop: 2,
        },
        buttonChevron: {
          marginLeft: 10,
        },
      }),
    [themedColors],
  );

  return (
    <View style={styles.container}>
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <CustomText style={styles.backText}>Atrás</CustomText>
        </TouchableOpacity>
      </View>

      {/* Título */}
      <View style={styles.titleContainer}>
        <CustomText style={styles.headerTitle}>Ajustes</CustomText>
      </View>

      {/* Avatar del usuario */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Image
            source={require("../../../../assets/image/adip_icon.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Saludo */}
      <CustomText style={styles.greetingText}>
        {userName ? `¡Hola ${userName}!` : "¡Hola!"}
      </CustomText>

      {/* Botones de configuración */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNavigateToProfiles}
        >
          <View style={styles.buttonIcon}>
            <Ionicons name="person" size={26} color={themedColors.background} />
          </View>
          <View style={styles.buttonTextContainer}>
            <CustomText style={styles.buttonTitle}>Perfiles</CustomText>
            <CustomText style={styles.buttonSubtitle}>
              Configura tus perfiles
            </CustomText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={themedColors.background}
            style={styles.buttonChevron}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNavigateToPersonalization}
        >
          <View style={styles.buttonIcon}>
            <Ionicons
              name="color-palette"
              size={26}
              color={themedColors.background}
            />
          </View>
          <View style={styles.buttonTextContainer}>
            <CustomText style={styles.buttonTitle}>Personalizar</CustomText>
            <CustomText style={styles.buttonSubtitle}>
              Configura colores y temas
            </CustomText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={themedColors.background}
            style={styles.buttonChevron}
          />
        </TouchableOpacity>

        {/* Botón de Soporte - Solo visible si hay usuario logueado */}
        {!isLoading && currentUser && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleNavigateToSupport}
          >
            <View style={styles.buttonIcon}>
              <Ionicons
                name="help-circle"
                size={26}
                color={themedColors.background}
              />
            </View>
            <View style={styles.buttonTextContainer}>
              <CustomText style={styles.buttonTitle}>Soporte</CustomText>
              <CustomText style={styles.buttonSubtitle}>
                Ayuda y asistencia
              </CustomText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={themedColors.background}
              style={styles.buttonChevron}
            />
          </TouchableOpacity>
        )}

        {/* Botón de Editar Emergencia - Solo visible si hay usuario logueado */}
        {!isLoading && currentUser && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleNavigateToEmergency}
          >
            <View style={styles.buttonIcon}>
              <Ionicons
                name="alert-circle"
                size={26}
                color={themedColors.background}
              />
            </View>
            <View style={styles.buttonTextContainer}>
              <CustomText style={styles.buttonTitle}>
                Editar Emergencia
              </CustomText>
              <CustomText style={styles.buttonSubtitle}>
                Configura tu informacion de emergencia
              </CustomText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={themedColors.background}
              style={styles.buttonChevron}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SettingsScreen;
