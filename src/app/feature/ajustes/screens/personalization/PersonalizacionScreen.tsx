import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

const PersonalizacionScreen = () => {
  const navigation = useNavigation();
  const {
    soloMayusculas,
    tamanioLetra,
    temaOscuro,
    setSoloMayusculas,
    setTamanioLetra,
    setTemaOscuro,
    getThemedColors,
    transformText,
  } = usePersonalization();

  const themedColors = getThemedColors();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSetTamanioPequenia = useCallback(() => {
    setTamanioLetra("pequenia");
  }, [setTamanioLetra]);

  const handleSetTamanioMediana = useCallback(() => {
    setTamanioLetra("mediana");
  }, [setTamanioLetra]);

  const handleSetTamanioGrande = useCallback(() => {
    setTamanioLetra("grande");
  }, [setTamanioLetra]);

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
      }),
    [themedColors],
  );

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
              tamanioLetra === "grande" && styles.sizeContainerColumn,
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sizeButton,
                tamanioLetra === "grande" && styles.sizeButtonColumn,
                tamanioLetra === "pequenia" && styles.sizeButtonActive,
              ]}
              onPress={handleSetTamanioPequenia}
              activeOpacity={0.8}
            >
              <CustomText
                style={[
                  styles.sizeText,
                  tamanioLetra === "pequenia" && styles.sizeTextActive,
                ]}
              >
                {transformText("Pequeña")}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                tamanioLetra === "grande" && styles.sizeButtonColumn,
                tamanioLetra === "mediana" && styles.sizeButtonActive,
              ]}
              onPress={handleSetTamanioMediana}
              activeOpacity={0.8}
            >
              <CustomText
                style={[
                  styles.sizeText,
                  tamanioLetra === "mediana" && styles.sizeTextActive,
                ]}
              >
                {transformText("Mediana")}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                tamanioLetra === "grande" && styles.sizeButtonColumn,
                tamanioLetra === "grande" && styles.sizeButtonActive,
              ]}
              onPress={handleSetTamanioGrande}
              activeOpacity={0.8}
            >
              <CustomText
                style={[
                  styles.sizeText,
                  tamanioLetra === "grande" && styles.sizeTextActive,
                ]}
              >
                {transformText("Grande")}
              </CustomText>
            </TouchableOpacity>
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
      </ScrollView>
    </View>
  );
};

export default PersonalizacionScreen;
