import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
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
import { useSupportForm } from "../../(hooks)/useSupportForm";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

const NewSupportEntryScreen = () => {
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const { subject, setSubject, query, setQuery, isSubmitting, handleSubmit } =
    useSupportForm(navigation);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        titleContainer: {
          paddingHorizontal: 20,
          paddingBottom: 20,
          alignItems: "center",
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          color: themedColors.text,
        },
        contentContainer: {
          paddingHorizontal: 20,
          paddingTop: 20,
          flex: 1,
        },
        questionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 40,
          textAlign: "center",
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
          backgroundColor: colors.green,
          borderRadius: 25,
          paddingVertical: 16,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
        },
        submitButtonText: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.white,
        },
      }),
    [themedColors],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Soporte")} />

      {/* Contenido */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionTitle}>
          {transformText("¿Cómo podemos ayudarte?")}
        </Text>

        {/* Campo Asunto */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{transformText("Asunto*")}</Text>
          <TextInput
            style={styles.input}
            placeholder={transformText("Escribe un asunto")}
            placeholderTextColor={themedColors.background}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Campo Consulta */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>{transformText("Consulta*")}</Text>
          <TextInput
            style={styles.textArea}
            placeholder={transformText("Escribe tu consulta*")}
            placeholderTextColor={themedColors.background}
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
          style={[styles.submitButton, isSubmitting && { opacity: 0.6 }]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting
              ? transformText("Enviando...")
              : transformText("Enviar informe")}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NewSupportEntryScreen;
