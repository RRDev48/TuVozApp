import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import CustomText from "@/src/app/feature/common/CustomText";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useTextSizeButtons } from "../../hooks/useTextSizeButtons";

const PersonalizacionScreen = () => {
  const navigation = useNavigation();
  const {
    soloMayusculas,
    tamanioLetra,
    temaOscuro,
    setSoloMayusculas,
    setTamanioLetra,
    setTemaOscuro,
    transformText,
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
        sizeContainer: {
          flexDirection: "row",
          gap: 8,
          marginTop: 16,
        },
        sizeContainerColumn: {
          flexDirection: "column",
          gap: 12,
        },
        sizeButton: {
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderRadius: 20,
          backgroundColor: themedColors.cardBackground,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 44,
        },
        sizeButtonColumn: {
          flex: 0,
          width: "100%",
        },
        sizeButtonActive: {
          backgroundColor: colors.yellow,
        },
        sizeText: {
          fontSize: 14,
          fontWeight: "600",
          color: themedColors.background,
          textAlign: "center",
        },
        sizeTextActive: {
          color: colors.black,
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
        resetButtonText: {
          color: colors.white,
          fontSize: 16,
          fontWeight: "600",
        },
      }),
    [themedColors],
  );
  const { buttons, handleSetSize, isGrande } = useTextSizeButtons(
    tamanioLetra,
    setTamanioLetra,
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleResetToDefaults = useCallback(async () => {
    try {
      await resetToDefaults();
    } catch (error) {
      // Error manejado internamente por el hook
    }
  }, [resetToDefaults]);

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />

      <ScreenTitle text={transformText("Personalización")} />

      <ScrollView style={styles.content}>
        {/* Opción: Solo Mayúsculas */}
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <CustomText style={styles.optionTitle}>
              {transformText("Solo mayúsculas")}
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

        {/* Opción: Tamaño de Letra */}
        <View style={styles.optionContainer}>
          <CustomText style={styles.optionTitle}>
            {transformText("Tamaño de la letra")}
          </CustomText>
          <View
            style={[
              styles.sizeContainer,
              isGrande && styles.sizeContainerColumn,
            ]}
          >
            {buttons.map((btn) => (
              <TouchableOpacity
                key={btn.size}
                style={[
                  styles.sizeButton,
                  isGrande && styles.sizeButtonColumn,
                  tamanioLetra === btn.size && styles.sizeButtonActive,
                ]}
                onPress={() => handleSetSize(btn.size)}
                activeOpacity={0.8}
              >
                <CustomText
                  style={[
                    styles.sizeText,
                    tamanioLetra === btn.size && styles.sizeTextActive,
                  ]}
                >
                  {transformText(btn.labelKey)}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Opción: Tema Oscuro */}
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <CustomText style={styles.optionTitle}>
              {transformText("Tema oscuro")}
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

        {/* Botón para resetear configuración */}
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetToDefaults}
            activeOpacity={0.8}
          >
            <CustomText style={styles.resetButtonText}>
              {transformText("Restablecer configuración por defecto")}
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalizacionScreen;
