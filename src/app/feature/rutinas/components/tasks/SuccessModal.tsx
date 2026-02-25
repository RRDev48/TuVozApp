import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import React, { useEffect } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";
import { useAutoClose } from "../../hooks/useAutoClose";
import { SuccessModalProps } from "../../models/component.props";

export const SuccessModal = ({
  visible,
  onClose,
  message = "Tarea creada con éxito!!",
}: SuccessModalProps) => {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  useAutoClose(visible, onClose, 2000);

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Círculo con marca de verificación que refuerza el mensaje de éxito. */}
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          {/* Mensaje de éxito, personalizable mediante props. */}
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  checkCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkMark: {
    fontSize: 50,
    color: "#00CED1",
    fontWeight: "bold",
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    textAlign: "center",
  },
});
