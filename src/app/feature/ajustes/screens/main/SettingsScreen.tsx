import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useUserData } from "@/src/app/feature/Home/(hooks)/useUserData";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useCurrentUser } from "../../(hooks)/useCurrentUser";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

const SettingsScreen = () => {
  const { userName } = useUserData();
  const { getThemedColors, transformText, tamanioLetra } = usePersonalization();
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
    navigation.navigate("Emergencias", { fromSettings: true });
  }, [navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        titleContainer: {
          paddingHorizontal: 20,
          paddingBottom: 20,
          alignItems: "center",
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          color: themedColors.text,
        },
        userInfoContainer: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginBottom: 40,
        },
        avatarContainer: {
          marginRight: 20,
        },
        avatarCircle: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: themedColors.primary,
          justifyContent: "center",
          alignItems: "center",
        },
        avatarImage: {
          width: 60,
          height: 60,
        },
        greetingText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          flex: 1,
        },
        buttonsContainer: {
          paddingHorizontal: 20,
        },
        buttonsContainerView: {
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
          backgroundColor: themedColors.transparent,
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
          fontWeight: "bold",
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
      <BackButton onPress={handleGoBack} />

      <ScreenTitle text={transformText("Ajustes")} />

      {/* Avatar y saludo del usuario */}
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Image
              source={require("../../../../assets/image/adip_icon.png")}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
        </View>
        <CustomText style={styles.greetingText}>
          {userName ? `¡Hola ${userName}!` : "¡Hola!"}
        </CustomText>
      </View>

      {/* Botones de configuración */}
      {tamanioLetra === "grande" ? (
        <ScrollView
          style={styles.buttonsContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={[styles.button, { marginBottom: 5 }]}
            activeOpacity={0.8}
            onPress={handleNavigateToProfiles}
          >
            <View style={styles.buttonIcon}>
              <Ionicons
                name="person"
                size={26}
                color={themedColors.background}
              />
            </View>
            <View style={styles.buttonTextContainer}>
              <CustomText style={styles.buttonTitle}>
                {transformText("Perfiles")}
              </CustomText>
              <CustomText style={styles.buttonSubtitle}>
                {transformText("Configura tus perfiles")}
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
            style={[styles.button, { marginBottom: 5 }]}
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
              <CustomText style={styles.buttonTitle}>
                {transformText("Personalizar")}
              </CustomText>
              <CustomText style={styles.buttonSubtitle}>
                {transformText("Configura colores y temas")}
              </CustomText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={themedColors.background}
              style={styles.buttonChevron}
            />
          </TouchableOpacity>

          {!isLoading && currentUser && (
            <TouchableOpacity
              style={[styles.button, { marginBottom: 5 }]}
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
                <CustomText style={styles.buttonTitle}>
                  {transformText("Soporte")}
                </CustomText>
                <CustomText style={styles.buttonSubtitle}>
                  {transformText("Ayuda y asistencia")}
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

          {!isLoading && currentUser && (
            <TouchableOpacity
              style={[styles.button, { marginBottom: 10 }]}
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
                  {transformText("Editar Emergencia")}
                </CustomText>
                <CustomText style={styles.buttonSubtitle}>
                  {transformText("Configura tu informacion de emergencia")}
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
        </ScrollView>
      ) : (
        <View style={styles.buttonsContainerView}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleNavigateToProfiles}
          >
            <View style={styles.buttonIcon}>
              <Ionicons
                name="person"
                size={26}
                color={themedColors.background}
              />
            </View>
            <View style={styles.buttonTextContainer}>
              <CustomText style={styles.buttonTitle}>
                {transformText("Perfiles")}
              </CustomText>
              <CustomText style={styles.buttonSubtitle}>
                {transformText("Configura tus perfiles")}
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
              <CustomText style={styles.buttonTitle}>
                {transformText("Personalizar")}
              </CustomText>
              <CustomText style={styles.buttonSubtitle}>
                {transformText("Configura colores y temas")}
              </CustomText>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={themedColors.background}
              style={styles.buttonChevron}
            />
          </TouchableOpacity>

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
                <CustomText style={styles.buttonTitle}>
                  {transformText("Soporte")}
                </CustomText>
                <CustomText style={styles.buttonSubtitle}>
                  {transformText("Ayuda y asistencia")}
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
                  {transformText("Editar Emergencia")}
                </CustomText>
                <CustomText style={styles.buttonSubtitle}>
                  {transformText("Configura tu informacion de emergencia")}
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
      )}
    </View>
  );
};

export default SettingsScreen;
