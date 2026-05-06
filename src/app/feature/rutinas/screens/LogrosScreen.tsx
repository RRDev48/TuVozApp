import i18n from "@/src/app/i18n";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useCurrentUserProfile } from "../../ajustes/hooks/useCurrentUserProfile";
import BackButton from "../../common/BackButton";
import CustomText from "../../common/CustomText";
import ScreenTitle from "../../common/ScreenTitle";
import { LogroItem, useLogros } from "../hooks/useLogros";

const GRAY_LOCKED = "#9E9E9E";

/** Hexágono/placa para un logro individual */
const LogroBadge = ({ item }: { item: LogroItem }) => {
  const color = item.unlocked ? item.color : GRAY_LOCKED;
  const opacity = item.unlocked ? 1 : 0.6;

  return (
    <View style={badgeStyles.wrapper}>
      <View
        style={[
          badgeStyles.hex,
          {
            backgroundColor: color,
            opacity,
            shadowColor: color,
          },
        ]}
      >
        <Ionicons
          name={item.icon as keyof typeof Ionicons.glyphMap}
          size={36}
          color="#FFFFFF"
        />
      </View>
      <CustomText
        style={[
          badgeStyles.label,
          { color: item.unlocked ? "#FFFFFF" : GRAY_LOCKED },
        ]}
      >
        {item.label}
      </CustomText>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    width: "33%",
    marginBottom: 20,
  },
  hex: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});

const LogrosScreen = () => {
  const navigation = useNavigation();
  const { getThemedColors, temaOscuro } = usePersonalization();
  const themedColors = getThemedColors();
  const { profileId } = useCurrentUserProfile();

  const { racha, objetivos, habitos, rachaMasLarga, rachaActual, loading } =
    useLogros(profileId || "");

  const styles = useMemo(
    () =>
      StyleSheet.create({
        screen: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        scroll: {
          flex: 1,
          paddingHorizontal: 20,
        },
        statsRow: {
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 24,
          paddingVertical: 14,
          borderRadius: 14,
          backgroundColor: themedColors.cardBackground,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: temaOscuro ? 0.35 : 0.1,
          shadowRadius: 6,
          elevation: 3,
        },
        statItem: {
          alignItems: "center",
        },
        statValue: {
          fontSize: 26,
          fontWeight: "bold",
          color: themedColors.secondary,
        },
        statLabel: {
          fontSize: 12,
          color: themedColors.secondary,
          marginTop: 2,
        },
        sectionTitle: {
          fontSize: 20,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 16,
          marginTop: 8,
        },
        grid: {
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        },
        loader: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [themedColors, temaOscuro],
  );

  if (loading) {
    return (
      <View style={[styles.screen, styles.loader]}>
        <ActivityIndicator size="large" color={themedColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <BackButton onPress={() => navigation.goBack()} />
      <ScreenTitle text={i18n.t('achievements')} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Stats rápidas */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <CustomText style={styles.statValue}>{rachaActual}</CustomText>
            <CustomText style={styles.statLabel}>
              {i18n.t('currentStreak')}
            </CustomText>
          </View>
          <View style={styles.statItem}>
            <CustomText style={styles.statValue}>{rachaMasLarga}</CustomText>
            <CustomText style={styles.statLabel}>
              {i18n.t('bestStreak')}
            </CustomText>
          </View>
        </View>

        {/* Racha más larga */}
        <CustomText style={styles.sectionTitle}>
          {i18n.t('longestStreak')}
        </CustomText>
        <View style={styles.grid}>
          {racha.map((item) => (
            <LogroBadge key={item.id} item={item} />
          ))}
        </View>

        {/* Objetivos */}
        <CustomText style={styles.sectionTitle}>
          {i18n.t('goals')}
        </CustomText>
        <View style={styles.grid}>
          {objetivos.map((item) => (
            <LogroBadge key={item.id} item={item} />
          ))}
        </View>

        {/* Hábitos */}
        <CustomText style={styles.sectionTitle}>
          {i18n.t('habits')}
        </CustomText>
        <View style={[styles.grid, { marginBottom: 32 }]}>
          {habitos.map((item) => (
            <LogroBadge key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LogrosScreen;
