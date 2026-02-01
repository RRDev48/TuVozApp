import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSupportStyles } from "../../(hooks)/useSupportStyles";
import { useSupportTickets } from "../../(hooks)/useSupportTickets";
import ZenithXAnimado from "../../../../assets/icon/ZenithXAnimado.svg";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";

const SupportScreen = () => {
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();
  const { tickets, isLoading } = useSupportTickets();
  const styles = useSupportStyles();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNewEntry = useCallback(() => {
    navigation.navigate("NewSupportEntryScreen");
  }, [navigation]);

  const statusColors = {
    open: { bg: "#FFFFFF", text: "#CC8400", border: "#CC8400" },
    in_progress: { bg: "#FFFFFF", text: "#2E5A9E", border: "#2E5A9E" },
    resolved: { bg: "#FFFFFF", text: "#357A38", border: "#357A38" },
    closed: { bg: "#FFFFFF", text: "#616161", border: "#616161" },
  };

  const statusLabels = {
    open: transformText("Abierto"),
    in_progress: transformText("En progreso"),
    resolved: transformText("Resuelto"),
    closed: transformText("Cerrado"),
  };

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
          <CustomText style={styles.emptyStateTitle}>
            {transformText("Aún no hay entradas")}
          </CustomText>
          <CustomText style={styles.emptyStateText}>
            {transformText("Cuando hagas uno, aparecerá aquí.")}
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
                      {
                        backgroundColor: statusColor.bg,
                        borderColor: statusColor.border,
                      },
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
            {transformText("Nueva entrada")}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportScreen;
