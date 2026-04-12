import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useMemo } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import CustomText from "../../../common/CustomText";
import { TimeInputFieldProps } from "../../models/component.props";

export const TimeInputField = ({
  label,
  value,
  error,
  placeholder,
  onChangeText,
  editable = true,
  icon,
}: TimeInputFieldProps) => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        timeInputContainer: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 5,
        },
        textInputLabel: {
          fontSize: 13,
          fontWeight: "bold",
          color: themedColors.text,
          marginRight: 5,
        },
        textTimeInput: {
          flex: 1,
          height: 40,
          borderWidth: 1,
          borderRadius: 5,
          paddingHorizontal: 10,
          backgroundColor: themedColors.primary,
          color: themedColors.secondary,
          fontSize: 15,
          fontWeight: "bold",
          minWidth: 80,
        },
        errorText: {
          color: "red",
          fontSize: 12,
          marginTop: 4,
          paddingLeft: 10,
        },
      }),
    [themedColors],
  );
  return (
    <View style={{ flex: 1, marginHorizontal: 5 }}>
      <View style={styles.timeInputContainer}>
        {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
        <CustomText style={styles.textInputLabel}>{label}</CustomText>
        <TextInput
          style={[
            styles.textTimeInput,
            error && {
              borderColor: "red",
              borderWidth: 2,
            },
            !editable && {
              backgroundColor: colors.lightGray,
              color: colors.gray,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={themedColors.secondary}
          keyboardType="numeric"
          maxLength={5}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
        />
      </View>
      {/* Mensaje de error mostrado debajo del campo cuando la hora es inválida. */}
      {error && (
        <CustomText style={styles.errorText}>
          {"Hora inválida (HH: 00-23, mm: 00-59)"}
        </CustomText>
      )}
    </View>
  );
};
