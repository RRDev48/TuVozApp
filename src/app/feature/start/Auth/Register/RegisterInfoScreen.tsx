import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ProgressBar from "../components/ProgressBar";
import { useRegisterInfo } from "../hooks/useRegisterInfo";

type RegisterInfoScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "RegisterInfo"
>;

type RegisterInfoScreenRouteProp = RouteProp<
  RootStackParamsList,
  "RegisterInfo"
>;

const RegisterInfoScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<RegisterInfoScreenNavigationProp>();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const route = useRoute<RegisterInfoScreenRouteProp>();
  const role = route.params?.role || "self";
  const isOwner = route.params?.isOwner ?? true;
  const ownerUserId = route.params?.ownerUserId;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const isSelfFlow = role === "self";
  const currentStep = isSelfFlow ? 2 : 3;
  const totalSteps = isSelfFlow ? 5 : 6;

  const MAX_LENGTH = 20;

  const handleNameChange = (text: string) => {
    if (text.length <= MAX_LENGTH) {
      setName(text);
    }
  };

  const { name, setName, isFormValid, validateForm } = useRegisterInfo({
    onValidationSuccess: ({ name }) => {
      navigation.navigate("EmailVerification", {
        name,
        role,
        isOwner,
        ownerUserId,
      });
    },
  });

  const handleContinue = () => {
    validateForm();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header con botón atrás y barra de progreso */}
        <View style={styles.headerContainer}>
          <View style={styles.headerRow}>
            <View style={styles.backButtonWrapper}>
              <BackButton
                onPress={() => navigation.goBack()}
                disablePersonalization
              />
            </View>

            {/* Barra de progreso */}
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
          </View>
        </View>

        {/* Título */}
        <Text
          style={[
            styles.title,
            isKeyboardVisible && styles.titleKeyboardVisible,
          ]}
        >
          {t('whatIsYourName')}
        </Text>

        {/* Subtítulo */}
        <Text
          style={[
            styles.subtitle,
            isKeyboardVisible && styles.subtitleKeyboardVisible,
          ]}
        >
          {t('gladYouAreHere')}
        </Text>

        {/* Espaciador */}
        <View
          style={[
            styles.spacer,
            isKeyboardVisible && styles.spacerKeyboardVisible,
          ]}
        />

        {/* Campo de texto */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={t('enterYourName')}
            placeholderTextColor={colors.gray}
            value={name}
            onChangeText={handleNameChange}
            autoCapitalize="words"
            autoComplete="name"
            maxLength={MAX_LENGTH}
          />
          <Text
            style={[
              styles.charCounter,
              name.length >= MAX_LENGTH && styles.charCounterError,
            ]}
          >
            {name.length}/{MAX_LENGTH}
          </Text>
        </View>

        {/* Botón Continuar */}
        <View
          style={[
            styles.buttonContainer,
            isKeyboardVisible && styles.buttonContainerKeyboardVisible,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.buttonDisabled,
            ]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isFormValid}
          >
            <Text style={styles.continueButtonText}>{t('continueButton')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
  },
  headerContainer: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    paddingRight: 24,
  },
  backButtonWrapper: {
    marginLeft: -20,
    marginTop: -40,
    marginBottom: -10,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.black,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 38,
    marginTop: 80,
  },
  titleKeyboardVisible: {
    marginTop: 20,
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.darkGray,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  subtitleKeyboardVisible: {
    fontSize: 14,
  },
  spacer: {
    height: 120,
  },
  spacerKeyboardVisible: {
    height: 40,
  },
  inputWrapper: {
    marginBottom: 40,
  },
  input: {
    fontSize: 18,
    color: colors.black,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomColor: colors.black,
    borderBottomWidth: 2,
  },
  charCounter: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "right",
    marginTop: 8,
  },
  charCounterError: {
    color: colors.red,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 60,
  },
  buttonContainerKeyboardVisible: {
    flex: 0,
    paddingBottom: 20,
  },
  continueButton: {
    backgroundColor: colors.green,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default RegisterInfoScreen;
