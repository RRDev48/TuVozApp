import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import type { Language } from "@/src/app/contexts/models/personalization.types";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import CustomText from "@/src/app/feature/common/CustomText";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";

const PersonalizacionScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    soloMayusculas,
    temaOscuro,
    idioma,
    idiomaCargando,
    setSoloMayusculas,
    setTemaOscuro,
    setIdioma,
    resetToDefaults,
    getThemedColors,
  } = usePersonalization();

  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        content: {
          flex: 1,
          paddingHorizontal: 16,
        },
        optionContainer: {
          marginBottom: 40,
        },
        optionRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        optionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
        },
        switchContainer: {
          borderWidth: 2,
          borderRadius: 20,
          padding: 2,
        },
        switchContainerActive: {
          borderColor: colors.green,
        },
        switchContainerInactive: {
          borderColor: colors.red,
        },
        optionSubtitle: {
          fontSize: 14,
          fontWeight: "600",
          color: themedColors.text,
          marginTop: 4,
        },
        optionDescription: {
          fontSize: 12,
          color: themedColors.text,
          opacity: 0.7,
          marginTop: 8,
        },
        resetButton: {
          backgroundColor: colors.red,
          borderRadius: 12,
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: "center",
          marginTop: 10,
        },
        resetButtonDisabled: {
          opacity: 0.5,
        },
        resetButtonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: "600",
        },
        languageContainer: {
          marginBottom: 40,
        },
        languageRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        languageLoadingContainer: {
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        },
        languageButton: {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 8,
          borderWidth: 2,
        },
        languageButtonActive: {
          borderColor: colors.green,
        },
        languageButtonInactive: {
          borderColor: colors.gray,
        },
        languageButtonText: {
          fontSize: 16,
          fontWeight: "600",
        },
        languageButtonTextActive: {
          color: colors.green,
        },
        languageButtonTextInactive: {
          color: themedColors.text,
        },
      }),
    [themedColors],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleResetToDefaults = useCallback(async () => {
    try {
      await resetToDefaults();
    } catch (error) {}
  }, [resetToDefaults]);

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} disabled={idiomaCargando} />

      <ScreenTitle text={t('personalization')} />

      <ScrollView style={styles.content}>
        {/* Opción: Solo Mayúsculas */}
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <CustomText style={styles.optionTitle}>
              {t('uppercaseOnly')}
            </CustomText>
            <View
              style={[
                styles.switchContainer,
                soloMayusculas
                  ? styles.switchContainerActive
                  : styles.switchContainerInactive,
              ]}
            >
              <Switch
                value={soloMayusculas}
                onValueChange={setSoloMayusculas}
                trackColor={{ true: colors.green }}
                thumbColor={colors.gray}
              />
            </View>
          </View>
        </View>

        {/* Opción: Tema Oscuro */}
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <CustomText style={styles.optionTitle}>
              {t('darkTheme')}
            </CustomText>
            <View
              style={[
                styles.switchContainer,
                temaOscuro
                  ? styles.switchContainerActive
                  : styles.switchContainerInactive,
              ]}
            >
              <Switch
                value={temaOscuro}
                onValueChange={setTemaOscuro}
                trackColor={{ true: colors.green }}
                thumbColor={colors.gray}
              />
            </View>
          </View>
        </View>

        {/* Opción: Idioma */}
        <View style={styles.languageContainer}>
          <CustomText style={styles.optionTitle}>{t('language')}</CustomText>
          {idiomaCargando ? (
            <View style={styles.languageLoadingContainer}>
              <ActivityIndicator size="large" color={colors.green} />
            </View>
          ) : (
            <View style={styles.languageRow}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  idioma === "es"
                    ? styles.languageButtonActive
                    : styles.languageButtonInactive,
                ]}
                onPress={() => setIdioma("es")}
                activeOpacity={0.8}
                disabled={idiomaCargando}
              >
                <CustomText
                  style={[
                    styles.languageButtonText,
                    idioma === "es"
                      ? styles.languageButtonTextActive
                      : styles.languageButtonTextInactive,
                  ]}
                >
                  Español
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  idioma === "en"
                    ? styles.languageButtonActive
                    : styles.languageButtonInactive,
                ]}
                onPress={() => setIdioma("en")}
                activeOpacity={0.8}
                disabled={idiomaCargando}
              >
                <CustomText
                  style={[
                    styles.languageButtonText,
                    idioma === "en"
                      ? styles.languageButtonTextActive
                      : styles.languageButtonTextInactive,
                  ]}
                >
                  English
                </CustomText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Botón para resetear configuración */}
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.resetButton,
              idiomaCargando && styles.resetButtonDisabled,
            ]}
            onPress={handleResetToDefaults}
            activeOpacity={0.8}
            disabled={idiomaCargando}
          >
            <CustomText style={styles.resetButtonText}>
              {t('resetToDefaults')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalizacionScreen;
