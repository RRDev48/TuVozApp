import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
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

  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.container}>
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <Text style={styles.backText}>Atrás</Text>
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
                trackColor={{ false: colors.lightGray, true: colors.blue }}
                thumbColor={colors.white}
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
              onPress={() => setTamanioLetra("pequenia")}
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
              onPress={() => setTamanioLetra("mediana")}
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
              onPress={() => setTamanioLetra("grande")}
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
                trackColor={{ false: colors.lightGray, true: colors.blue }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalizacionScreen;
