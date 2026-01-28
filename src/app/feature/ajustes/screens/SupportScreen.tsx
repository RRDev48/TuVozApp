import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ZenithXAnimado from "../../../assets/icon/ZenithXAnimado.svg";

const SupportScreen = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

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
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyStateTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      marginBottom: 16,
    },
    emptyStateText: {
      fontSize: 16,
      color: themedColors.text,
      textAlign: "center",
      opacity: 0.7,
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 10,
    },
    newEntryButton: {
      backgroundColor: themedColors.cardBackground,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    newEntryButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: themedColors.background,
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
        <CustomText style={styles.headerTitle}>Mis entradas</CustomText>
      </View>

      {/* Contenido - Estado vacío */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <ZenithXAnimado
          width={120}
          height={120}
          style={{ marginBottom: 20, marginTop: -100 }}
        />
        <CustomText style={styles.emptyStateTitle}>
          Aún no hay entradas
        </CustomText>
        <CustomText style={styles.emptyStateText}>
          Cuando hagas uno, aparecerá aquí.
        </CustomText>
      </ScrollView>

      {/* Botón Nueva entrada - Siempre abajo */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.newEntryButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("NewSupportEntryScreen")}
        >
          <CustomText style={styles.newEntryButtonText}>
            Nueva entrada
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportScreen;
