import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useUserData } from "@/src/app/feature/Home/(hooks)/useUserData";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { useCurrentUser } from "../../(hooks)/useCurrentUser";
import { useSettingsButtons } from "../../(hooks)/useSettingsButtons";
import { useSettingsStyles } from "../../(hooks)/useSettingsStyles";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

const SettingsScreen = () => {
  const { userName } = useUserData();
  const { getThemedColors, transformText, tamanioLetra } = usePersonalization();
  const themedColors = getThemedColors();
  const { currentUser, isLoading } = useCurrentUser();
  const styles = useSettingsStyles();
  const buttons = useSettingsButtons(currentUser, isLoading);
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

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
