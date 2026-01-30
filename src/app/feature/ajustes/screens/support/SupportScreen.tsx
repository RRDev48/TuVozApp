import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSupportTickets } from "../../(hooks)/useSupportTickets";
import ZenithXAnimado from "../../../../assets/icon/ZenithXAnimado.svg";

const SupportScreen = () => {
  const { getThemedColors } = usePersonalization();
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
      open: { bg: "#FFA50080", text: "#CC8400" },
      in_progress: { bg: "#4A90E280", text: "#2E5A9E" },
      resolved: { bg: "#4CAF5080", text: "#357A38" },
      closed: { bg: "#9E9E9E80", text: "#616161" },
    }),
    [],
  );

  const statusLabels = useMemo(
    () => ({
      open: "Abierto",
      in_progress: "En progreso",
      resolved: "Resuelto",
      closed: "Cerrado",
    }),
    [],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
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
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        },
        emptyStateTitle: {
          fontSize: 24,
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
          fontSize: 16,
          fontWeight: "600",
          color: themedColors.background,
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
          color: themedColors.background,
          flex: 1,
          marginRight: 8,
        },
        ticketStatus: {
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 12,
        },
        ticketStatusText: {
          fontSize: 12,
          fontWeight: "600",
        },
        ticketMessage: {
          fontSize: 14,
          color: themedColors.background,
          opacity: 0.8,
          marginBottom: 8,
        },
        ticketDate: {
          fontSize: 12,
          color: themedColors.background,
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
      {/* Header con botón de volver */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <CustomText style={styles.backText}>Atrás</CustomText>
        </TouchableOpacity>
      </View>

      {/* Título */}
      <View style={styles.titleContainer}>
        <CustomText style={styles.headerTitle}>Mis entradas</CustomText>
      </View>

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
          <CustomText style={styles.emptyStateTitle}>
            Aún no hay entradas
          </CustomText>
          <CustomText style={styles.emptyStateText}>
            Cuando hagas uno, aparecerá aquí.
          </CustomText>
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
                  <CustomText style={styles.ticketSubject}>
                    {ticket.subject}
                  </CustomText>
                  <View
                    style={[
                      styles.ticketStatus,
                      { backgroundColor: statusColor.bg },
                    ]}
                  >
                    <CustomText
                      style={[
                        styles.ticketStatusText,
                        { color: statusColor.text },
                      ]}
                    >
                      {statusLabels[ticket.status]}
                    </CustomText>
                  </View>
                </View>
                <CustomText
                  style={styles.ticketMessage}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {ticket.message}
                </CustomText>
                <CustomText style={styles.ticketDate}>
                  {new Date(ticket.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </CustomText>
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
          <CustomText style={styles.newEntryButtonText}>
            Nueva entrada
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportScreen;
