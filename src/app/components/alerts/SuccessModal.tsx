import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import React, { useEffect, useState } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import { SuccessModalProps } from "./(models)/alert.types";

const SuccessModal = ({
  visible,
  title,
  onClose,
  autoCloseDelay = 3000,
  showDelay = 0,
}: SuccessModalProps) => {
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (visible) {
      if (showDelay > 0) {
        const showTimer = setTimeout(() => {
          setShowModal(true);
        }, showDelay);
        return () => clearTimeout(showTimer);
      } else {
        setShowModal(true);
      }
    } else {
      setShowModal(false);
    }
  }, [visible, showDelay]);

  useEffect(() => {
    if (showModal && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [showModal, onClose, autoCloseDelay]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themedColors.background,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    },
    iconContainer: {
      marginBottom: 30,
    },
    gifImage: {
      width: 120,
      height: 120,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      lineHeight: 28,
    },
  });

  return (
    <Modal
      visible={showModal}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@/src/app/assets/gif/verificado.gif")}
            style={styles.gifImage}
          />
        </View>

        <Text style={styles.title}>{transformText(title)}</Text>
      </View>
    </Modal>
  );
};

export default SuccessModal;
