import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import CustomText from "@/src/app/feature/common/CustomText";
import { useUserData } from "@/src/app/feature/Home/hooks/useUserData";
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
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useSettingsButtons } from "../../hooks/useSettingsButtons";

const SettingsScreen = () => {
  const { userName } = useUserData();
  const { getThemedColors, transformText, tamanioLetra } = usePersonalization();
  const themedColors = getThemedColors();
  const { currentUser, isLoading } = useCurrentUser();
  const buttons = useSettingsButtons(currentUser, isLoading);
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
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

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderButton = useCallback(
    (button: any) => (
      <TouchableOpacity
        key={button.id}
        style={styles.button}
        activeOpacity={0.8}
        onPress={button.onPress}
      >
        <View style={styles.buttonIcon}>
          <Ionicons
            name={button.iconName as any}
            size={26}
            color={themedColors.background}
          />
        </View>
        <View style={styles.buttonTextContainer}>
          <CustomText style={styles.buttonTitle}>
            {transformText(button.titleKey)}
          </CustomText>
          <CustomText style={styles.buttonSubtitle}>
            {transformText(button.subtitleKey)}
          </CustomText>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={themedColors.background}
          style={styles.buttonChevron}
        />
      </TouchableOpacity>
    ),
    [styles, themedColors, transformText],
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
          {buttons.map((button) => (
            <View key={button.id} style={{ marginBottom: 5 }}>
              {renderButton(button)}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.buttonsContainerView}>
          {buttons.map(renderButton)}
        </View>
      )}
    </View>
  );
};

export default SettingsScreen;
