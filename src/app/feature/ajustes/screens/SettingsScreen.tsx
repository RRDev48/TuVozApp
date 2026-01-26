import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useUserData } from "@/src/app/feature/Home/(hooks)/useUserData";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SettingsScreen = () => {
  const { userName } = useUserData();
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
    avatarContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    avatarCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: themedColors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarImage: {
      width: 80,
      height: 80,
    },
    greetingText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 40,
      color: themedColors.text,
    },
    buttonsContainer: {
      paddingHorizontal: 40,
      gap: 16,
    },
    button: {
      backgroundColor: themedColors.cardBackground,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: themedColors.background,
      fontSize: 16,
      fontWeight: "600",
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
        <CustomText style={styles.headerTitle}>Ajustes</CustomText>
      </View>

      {/* Avatar del usuario */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatarCircle}>
          <Image
            source={require("../../../assets/image/adip_icon.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Saludo */}
      <CustomText style={styles.greetingText}>
        {userName ? `¡Hola ${userName}!` : "¡Hola!"}
      </CustomText>

      {/* Botones de configuración */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <CustomText style={styles.buttonText}>
            Configura los Perfiles
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("PersonalizationScreen")}
        >
          <CustomText style={styles.buttonText}>Personalizar</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;
