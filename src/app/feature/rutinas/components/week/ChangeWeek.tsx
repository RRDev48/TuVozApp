import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../common/CustomText";
import { useWeekRoutine } from "../../hooks/useWeekRoutine";
import { ChangeWeekProps } from "../../models/component.props";

const ChangeWeek = ({ onChangeWeek, currentWeekStart }: ChangeWeekProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 20,
        },
        title: {
          fontSize: 20,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          flex: 1,
        },
      }),
    [themedColors],
  );
  const handleChangeWeek = (increment: number) => {
    const newStartDate = new Date(currentWeekStart);
    newStartDate.setDate(currentWeekStart.getDate() + increment * 7);
    onChangeWeek(newStartDate);
  };

  return (
    <View style={styles.container}>
      {/* Botón para ir a la semana anterior (resta 7 días). */}
      <TouchableOpacity onPress={() => handleChangeWeek(-1)}>
        <Ionicons
          name="chevron-back-outline"
          size={24}
          color={themedColors.text}
        />
      </TouchableOpacity>

      {/* Texto central que funciona como encabezado de la sección de rutinas. */}
      <CustomText style={styles.title}>
        {i18n.t('startDay')}
      </CustomText>

      {/* Botón para ir a la semana siguiente (suma 7 días). */}
      <TouchableOpacity onPress={() => handleChangeWeek(1)}>
        <Ionicons
          name="chevron-forward-outline"
          size={24}
          color={themedColors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChangeWeek;
