import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSupportTickets } from "../../(hooks)/useSupportTickets";
import ZenithXAnimado from "../../../../assets/icon/ZenithXAnimado.svg";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

const SupportScreen = () => {
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const { tickets, isLoading, loadTickets } = useSupportTickets();

  useFocusEffect(
    useCallback(() => {
      loadTickets();
    }, [loadTickets]),
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNewEntry = useCallback(() => {
    navigation.navigate("NewSupportEntryScreen");
  }, [navigation]);

  const statusColors = useMemo(
    () => ({
      open: { bg: "#FFFFFF", text: "#CC8400", border: "#CC8400" },
      in_progress: { bg: "#FFFFFF", text: "#2E5A9E", border: "#2E5A9E" },
      resolved: { bg: "#FFFFFF", text: "#357A38", border: "#357A38" },
      closed: { bg: "#FFFFFF", text: "#616161", border: "#616161" },
    }),
    [],
  );

  const statusLabels = useMemo(
    () => ({
      open: transformText("Abierto"),
      in_progress: transformText("En progreso"),
      resolved: transformText("Resuelto"),
      closed: transformText("Cerrado"),
    }),
    [transformText],
  );

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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        },
        emptyStateTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 16,
        },
        emptyStateText: {
          fontSize: 16,
          color: themedColors.text,
          textAlign: "center",
          opacity: 0.7,
        },
        buttonContainer: {
          paddingHorizontal: 20,
          paddingBottom: 30,
          paddingTop: 10,
        },
        newEntryButton: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 25,
          paddingVertical: 16,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
        },
        newEntryButtonText: {
          fontSize: 18,
          fontWeight: "600",
          color: themedColors.secondary,
        },
        ticketCard: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        },
        ticketHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        },
        ticketSubject: {
          fontSize: 16,
          fontWeight: "700",
          color: themedColors.secondary,
          flex: 1,
          marginRight: 8,
        },
        ticketStatus: {
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
          borderWidth: 2,
        },
        ticketStatusText: {
          fontSize: 12,
          fontWeight: "bold",
        },
        ticketMessage: {
          fontSize: 14,
          color: themedColors.secondary,
          opacity: 0.8,
          marginBottom: 8,
        },
        ticketDate: {
          fontSize: 12,
          color: themedColors.secondary,
          opacity: 0.6,
        },
        ticketsContainer: {
          paddingHorizontal: 20,
          paddingBottom: 20,
        },
      }),
    [themedColors],
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />

      <ScreenTitle text={transformText("Mis entradas")} />

      {/* Contenido */}
      {isLoading ? (
        <View style={styles.contentContainer}>
          <ActivityIndicator size="large" color={themedColors.primary} />
        </View>
      ) : tickets.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ZenithXAnimado
            width={120}
            height={120}
            style={{ marginBottom: 20, marginTop: -100 }}
          />
          <Text style={styles.emptyStateTitle}>
            {transformText("Aún no hay entradas")}
          </Text>
          <Text style={styles.emptyStateText}>
            {transformText("Cuando hagas uno, aparecerá aquí.")}
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.ticketsContainer}
          showsVerticalScrollIndicator={false}
        >
          {tickets.map((ticket) => {
            const statusColor = statusColors[ticket.status];

            return (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                  <View
                    style={[
                      styles.ticketStatus,
                      {
                        backgroundColor: statusColor.bg,
                        borderColor: statusColor.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ticketStatusText,
                        { color: statusColor.text },
                      ]}
                    >
                      {statusLabels[ticket.status]}
                    </Text>
                  </View>
                </View>
                <Text
                  style={styles.ticketMessage}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {ticket.message}
                </Text>
                <Text style={styles.ticketDate}>
                  {new Date(ticket.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Botón Nueva entrada - Siempre abajo */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.newEntryButton}
          activeOpacity={0.8}
          onPress={handleNewEntry}
        >
          <Text style={styles.newEntryButtonText}>
            {transformText("Nueva entrada")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportScreen;
