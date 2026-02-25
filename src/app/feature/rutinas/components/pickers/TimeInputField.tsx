import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TimeInputFieldProps } from "../../models/component.props";

const styles = StyleSheet.create({
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },

  textInputLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.blue,
    marginRight: 10,
  },

  textTimeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    color: colors.blue,
  },
});

export const TimeInputField = ({
  label,
  value,
  error,
  placeholder,
  onChangeText,
}: TimeInputFieldProps) => {
  return (
    <View style={{ width: "100%", marginBottom: 15 }}>
      <View style={styles.timeInputContainer}>
        <Text style={styles.textInputLabel}>{label}</Text>
        <TextInput
          style={[
            styles.textTimeInput,
            error && {
              borderColor: "red",
              borderWidth: 2,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.blue}
          keyboardType="numeric"
          maxLength={5}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {/* Mensaje de error mostrado debajo del campo cuando la hora es inválida. */}
      {error && (
        <Text
          style={{
            color: "red",
            fontSize: 12,
            marginTop: 4,
            paddingLeft: 10,
          }}
        >
          {"Hora inválida (HH: 00-23, mm: 00-59)"}
        </Text>
      )}
    </View>
  );
};
