import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import CustomText from "@/src/app/feature/common/CustomText";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ZenithXAnimado from "../../../assets/icon/ZenithXAnimado.svg";

const CardsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        backButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 4,
        },
        backText: {
          fontSize: 18,
          fontWeight: "500",
          color: themedColors.text,
        },
        content: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 30,
          marginTop: -30,
        },
        icon: {
          width: 180,
          height: 180,
        },
        text: {
          fontSize: 32,
          fontWeight: "700",
          color: themedColors.text,
        },
      }),
    [themedColors],
  );

  return (
    <View style={styles.container}>
      {/* Botón Atrás */}
      <TouchableOpacity
        onPress={navigation.goBack}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={themedColors.text} />
        <CustomText style={styles.backText}>Atrás</CustomText>
      </TouchableOpacity>

      {/* Contenido centrado */}
      <View style={styles.content}>
        <ZenithXAnimado width={180} height={180} />
        <CustomText style={styles.text}>Próximamente</CustomText>
      </View>
    </View>
  );
};

export default CardsScreen;
