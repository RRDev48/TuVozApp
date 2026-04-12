import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import BackButton from "@/src/app/feature/common/BackButton";
import CustomText from "@/src/app/feature/common/CustomText";
import ScreenTitle from "@/src/app/feature/common/ScreenTitle";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
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
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text="Tarjetas" />

      {/* Contenido centrado */}
      <View style={styles.content}>
        <ZenithXAnimado width={180} height={180} />
        <CustomText style={styles.text}>Próximamente</CustomText>
      </View>
    </View>
  );
};

export default CardsScreen;
