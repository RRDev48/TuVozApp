import { useActiveProfile } from "@/src/app/contexts/ActiveProfileContext";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import CustomText from "@/src/app/feature/common/CustomText";
import { useUserData } from "@/src/app/feature/Home/hooks/useUserData";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import clearAppCache from "@/src/app/services/cacheCleaner.Service";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import SkeletonAvatar from "@/src/app/components/common/SkeletonAvatar";
import SkeletonText from "@/src/app/components/common/SkeletonText";
import Translate from "../../../common/Translate";
import { authService } from "../../../start/Auth/services/auth.Service";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  SettingsButton,
  useSettingsButtons,
} from "../../hooks/useSettingsButtons";

const ADIP_ICON = require("../../../../assets/image/adip_icon.png");
const SettingsScreen = () => {
  const { t } = useLanguageRefresh();
  const {
    userName,
    avatarUrl,
    loading: isLoadingUser,
    refreshUser,
  } = useUserData();
  const { getThemedColors, reloadLocalPreferences } = usePersonalization();
  const themedColors = getThemedColors();
  const { currentUser, isLoading } = useCurrentUser();
  const buttons = useSettingsButtons(currentUser, isLoading);
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { clear: clearActiveProfile } = useActiveProfile();

  useEffect(() => {
    refreshUser();
  }, []);

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
          overflow: "hidden",
        },
        avatarImage: {
          width: 80,
          height: 80,
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
        logoutButton: {
          position: "absolute",
          bottom: 28,
          left: 20,
          right: 20,
          backgroundColor: "transparent",
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
          borderWidth: 2,
          borderColor: colors.red,
        },
        logoutButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.red,
        },
      }),
    [themedColors],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLogout = useCallback(async () => {
    const result = await authService.signOut();
    if (result.success) {
      await clearAppCache();
      await clearActiveProfile();
      await reloadLocalPreferences();
      navigation.reset({
        index: 0,
        routes: [{ name: "Onboarding" }],
      });
    }
  }, [navigation, reloadLocalPreferences, clearActiveProfile]);

  const renderButton = useCallback(
    (button: SettingsButton) => (
      <TouchableOpacity
        key={button.id}
        style={styles.button}
        activeOpacity={0.8}
        onPress={button.onPress}
      >
        <View style={styles.buttonIcon}>
          <Ionicons
            name={button.iconName}
            size={26}
            color={themedColors.background}
          />
        </View>
        <View style={styles.buttonTextContainer}>
          <CustomText style={styles.buttonTitle}>
            <Translate>{button.titleKey}</Translate>
          </CustomText>
          <CustomText style={styles.buttonSubtitle}>
            <Translate>{button.subtitleKey}</Translate>
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
    [styles, themedColors],
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />

      <ScreenTitle text={t("settingsTitle")} />

      {/* Avatar y saludo del usuario */}
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {isLoadingUser ? (
              <SkeletonAvatar size={80} />
            ) : (
              <Image
                source={avatarUrl ? { uri: avatarUrl } : ADIP_ICON}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
        {isLoadingUser ? (
          <View style={{ flex: 1, gap: 8 }}>
            <SkeletonText width={150} height={20} />
          </View>
        ) : (
          <CustomText style={styles.greetingText}>
            {userName ? `¡Hola ${userName}!` : t("greetingFallback")}
          </CustomText>
        )}
      </View>

      {/* Botones de configuración */}
      <View style={styles.buttonsContainerView}>
        {buttons.map(renderButton)}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t("logout")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
