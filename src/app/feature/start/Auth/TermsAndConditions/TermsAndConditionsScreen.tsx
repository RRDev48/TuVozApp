import ZenithXAnimado from "@/src/app/assets/icon/ZenithXAnimado.svg";
import TuvozLogo from "@/src/app/assets/image/tuvoz.svg";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type TermsNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "TermsAndConditions"
>;

const TermsAndConditionsScreen = () => {
  const { t } = useLanguageRefresh();
  const navigation = useNavigation<TermsNavigationProp>();
  const sections = [
    {
      title: t('acceptanceOfUse'),
      text: t('acceptanceOfUseText'),
    },
    {
      title: t('useOfApplication'),
      text: t('useOfApplicationText'),
    },
    {
      title: t('accountAndSecurity'),
      text: t('accountAndSecurityText'),
    },
    {
      title: t('privacyAndData'),
      text: t('privacyAndDataText'),
    },
    {
      title: t('serviceAvailability'),
      text: t('serviceAvailabilityText'),
    },
    {
      title: t('changesInTerms'),
      text: t('changesInTermsText'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoSlot}>
          <TuvozLogo width={120} height={120} />
        </View>
        <View style={styles.dividerSlot}>
          <Text style={styles.logoDivider}>x</Text>
        </View>
        <View style={styles.logoSlot}>
          <ZenithXAnimado width={60} height={60} />
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>{t('termsAndConditionsTitle')}</Text>
        <Text style={styles.subtitle}>
          {t('termsSubtitle')}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, index) => (
          <View key={section.title} style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionNumberBubble}>
                <Text style={styles.sectionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.paragraph}>{section.text}</Text>
            {index < sections.length - 1 ? (
              <View style={styles.sectionDivider} />
            ) : null}
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>{t('understood')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSlot: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerSlot: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logoDivider: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.darkBlue,
    textAlign: "center",
    marginTop: -6,
  },
  headerContainer: {
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 10,
    marginTop: -4,
    marginBottom: 14,
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.darkBlue,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#314A71",
    marginBottom: 2,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 4,
    paddingBottom: 4,
    gap: 0,
  },
  sectionBlock: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionNumberBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sectionNumberText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.darkBlue,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#2D3F5D",
    paddingLeft: 40,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#DCE5F5",
    marginTop: 12,
    marginLeft: 40,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 8,
  },
  button: {
    backgroundColor: "#04A84A",
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
});

export default TermsAndConditionsScreen;
