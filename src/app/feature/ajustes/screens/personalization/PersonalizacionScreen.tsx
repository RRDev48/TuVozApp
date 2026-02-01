import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { usePersonalizationStyles } from "../../(hooks)/usePersonalizationStyles";
import { useTextSizeButtons } from "../../(hooks)/useTextSizeButtons";
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
    transformText,
  } = usePersonalization();

  const styles = usePersonalizationStyles();
  const { buttons, handleSetSize, isGrande } = useTextSizeButtons(
    tamanioLetra,
    setTamanioLetra,
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
      </ScrollView>
    </View>
  );
};

export default PersonalizacionScreen;
