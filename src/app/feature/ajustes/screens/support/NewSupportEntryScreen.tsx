import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import ErrorModal from "@/src/app/feature/common/alerts/ErrorModal";
import SuccessModal from "@/src/app/feature/common/alerts/SuccessModal";
import CustomText from "@/src/app/feature/common/CustomText";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import i18n from "@/src/app/i18n";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useSupportForm } from "../../hooks/useSupportForm";

const NewSupportEntryScreen = () => {
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const navigationRaw = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const navigation = navigationRaw ?? ({} as StackNavigationProp<RootStackParamsList, "NewSupportEntryScreen">);

  const {
    subject,
    setSubject,
    query,
    setQuery,
    isSubmitting,
    handleSubmit,
    showSuccessModal,
    handleSuccessModalClose,
    showErrorModal,
    setShowErrorModal,
    errorMessage,
  } = useSupportForm(navigation);

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

      <ScreenTitle text={i18n.t('support')} />

      {/* Contenido */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <CustomText style={styles.questionTitle}>
          {i18n.t('howCanWeHelp')}
        </CustomText>

        {/* Campo Asunto */}
        <View style={styles.fieldContainer}>
          <CustomText style={styles.label}>
            {i18n.t('subject')}
          </CustomText>
          <TextInput
            style={styles.input}
            placeholder={i18n.t('writeSubject')}
            placeholderTextColor={themedColors.background}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        {/* Campo Consulta */}
        <View style={styles.fieldContainer}>
          <CustomText style={styles.label}>
            {i18n.t('query')}
          </CustomText>
          <TextInput
            style={styles.textArea}
            placeholder={i18n.t('writeQuery')}
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
          <CustomText style={styles.submitButtonText}>
            {isSubmitting
              ? i18n.t('sending')
              : i18n.t('sendReport')}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* Modales */}
      <SuccessModal
        visible={showSuccessModal}
        title={i18n.t('supportQuerySent')}
        onClose={handleSuccessModalClose}
        autoCloseDelay={4000}
        showDelay={300}
      />

      <ErrorModal
        visible={showErrorModal}
        title={i18n.t('error')}
        message={errorMessage}
        onClose={setShowErrorModal}
        onDismiss={() => {}}
        showDelay={200}
        autoCloseDelay={0}
      />
    </KeyboardAvoidingView>
  );
};

export default NewSupportEntryScreen;
