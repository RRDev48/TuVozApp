import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

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
        content: {
          flex: 1,
          paddingHorizontal: 20,
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
          gap: 12,
          marginTop: 16,
        },
        sizeButton: {
          flex: 1,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 20,
          backgroundColor: themedColors.cardBackground,
          alignItems: "center",
          justifyContent: "center",
        },
        sizeButtonActive: {
          backgroundColor: colors.yellow,
        },
        sizeText: {
          fontSize: 14,
          fontWeight: "600",
          color: themedColors.background,
        },
        sizeTextActive: {
          color: colors.black,
        },
        switchContainer: {
          borderWidth: 2,
          borderColor: themedColors.primary,
          borderRadius: 20,
          padding: 2,
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
        <CustomText style={styles.headerTitle}>Personalización</CustomText>
      </View>

      <ScrollView style={styles.content}>
        {/* Opción: Solo Mayúsculas */}
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <CustomText style={styles.optionTitle}>Solo mayúsculas</CustomText>
            <View style={styles.switchContainer}>
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
          <CustomText style={styles.optionTitle}>Tamaño de la letra</CustomText>
          <View style={styles.sizeContainer}>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                tamanioLetra === "pequenia" && styles.sizeButtonActive,
              ]}
              onPress={handleSetTamanioPequenia}
              activeOpacity={0.8}
            >
              <CustomText
                disablePersonalization={true}
                style={[
                  styles.sizeText,
                  tamanioLetra === "pequenia" && styles.sizeTextActive,
                ]}
              >
                Pequeña
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                tamanioLetra === "mediana" && styles.sizeButtonActive,
              ]}
              onPress={handleSetTamanioMediana}
              activeOpacity={0.8}
            >
              <CustomText
                disablePersonalization={true}
                style={[
                  styles.sizeText,
                  tamanioLetra === "mediana" && styles.sizeTextActive,
                ]}
              >
                Mediana
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sizeButton,
                tamanioLetra === "grande" && styles.sizeButtonActive,
              ]}
              onPress={handleSetTamanioGrande}
              activeOpacity={0.8}
            >
              <CustomText
                disablePersonalization={true}
                style={[
                  styles.sizeText,
                  tamanioLetra === "grande" && styles.sizeTextActive,
                ]}
              >
                Grande
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Opción: Tema Oscuro */}
        <View style={styles.optionContainer}>
          <View style={styles.optionRow}>
            <CustomText style={styles.optionTitle}>Tema oscuro</CustomText>
            <View style={styles.switchContainer}>
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
