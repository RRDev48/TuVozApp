import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const NewSupportEntryScreen = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const [subject, setSubject] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!subject.trim() || !query.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }
    console.log("Enviando informe:", { subject, query });
    // Aquí iría la lógica para enviar el informe
    navigation.goBack();
  };

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
      paddingHorizontal: 20,
      paddingTop: 20,
      flex: 1,
    },
    questionTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: themedColors.text,
      marginBottom: 40,
      textAlign: "left",
    },
    fieldContainer: {
      marginBottom: 30,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: themedColors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: themedColors.cardBackground,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: themedColors.background,
    },
    textArea: {
      backgroundColor: themedColors.cardBackground,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: themedColors.background,
      minHeight: 200,
      textAlignVertical: "top",
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 10,
    },
    submitButton: {
      backgroundColor: themedColors.cardBackground,
      borderRadius: 25,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: themedColors.background,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
        <CustomText style={styles.headerTitle}>Soporte</CustomText>
      </View>

      {/* Contenido */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <CustomText style={styles.questionTitle}>
          ¿Cómo podemos ayudarte?
        </CustomText>

        {/* Campo Asunto */}
        <View style={styles.fieldContainer}>
          <CustomText style={styles.label}>Asunto*</CustomText>
          <TextInput
            style={styles.input}
            placeholder="Escribe un asunto"
            placeholderTextColor={`${themedColors.background}80`}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Campo Consulta */}
        <View style={styles.fieldContainer}>
          <CustomText style={styles.label}>Consulta*</CustomText>
          <TextInput
            style={styles.textArea}
            placeholder="Escribe tu consulta*"
            placeholderTextColor={`${themedColors.background}80`}
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={8}
          />
        </View>
      </ScrollView>

      {/* Botón Enviar informe */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.8}
          onPress={handleSubmit}
        >
          <CustomText style={styles.submitButtonText}>
            Enviar informe
          </CustomText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewSupportEntryScreen;
