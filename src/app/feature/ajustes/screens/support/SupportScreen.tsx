import SkeletonText from "@/src/app/components/common/SkeletonText";
import SkeletonButton from "@/src/app/components/common/SkeletonButton";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import CustomText from "@/src/app/feature/common/CustomText";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ZenithXAnimado from "../../../../assets/icon/ZenithXAnimado.svg";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { supportService, SupportTicket } from "../../services/support.Service";
import i18n from "@/src/app/i18n";

const SupportScreen = () => {
  const { t } = useLanguageRefresh();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>() ?? ({} as StackNavigationProp<RootStackParamsList>);

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
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

  useFocusEffect(
    useCallback(() => {
      const fetchTickets = async () => {
        setIsLoading(true);
        const response = await supportService.getUserTickets();
        if ('data' in response && response.success) {
          setTickets(response.data);
        }
        setIsLoading(false);
      };
      fetchTickets();
    }, []),
  );

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
    open: t('statusOpen'),
    in_progress: t('statusInProgress'),
    resolved: t('statusResolved'),
    closed: t('statusClosed'),
  };

  const renderSkeletonSupport = () => (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />
      <ScreenTitle text={t("myEntries")} />
      <View style={styles.ticketsContainer}>
        {/* Ticket Skeleton 1 */}
        <View style={[styles.ticketCard, { backgroundColor: 'transparent' }]}>
          <View style={styles.ticketHeader}>
            <SkeletonText width="60%" height={20} />
            <SkeletonText width={80} height={24} borderRadius={12} />
          </View>
          <View style={{ marginTop: 8 }}>
            <SkeletonText width="90%" height={16} marginBottom={6} />
            <SkeletonText width="40%" height={14} />
          </View>
        </View>
        {/* Ticket Skeleton 2 */}
        <View style={[styles.ticketCard, { backgroundColor: 'transparent' }]}>
          <View style={styles.ticketHeader}>
            <SkeletonText width="50%" height={20} />
            <SkeletonText width={80} height={24} borderRadius={12} />
          </View>
          <View style={{ marginTop: 8 }}>
            <SkeletonText width="85%" height={16} marginBottom={6} />
            <SkeletonText width="35%" height={14} />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <SkeletonButton height={56} borderRadius={25} />
      </View>
    </View>
  );

  if (isLoading && tickets.length === 0) {
    return renderSkeletonSupport();
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={handleGoBack} />

      <ScreenTitle text={t("myEntries")} />

      {/* Contenido */}
      {tickets.length === 0 ? (
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
            {t('noEntriesYet')}
          </CustomText>
          <CustomText style={styles.emptyStateText}>
            {t('noEntriesDescription')}
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
                  {new Date(ticket.created_at).toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
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
            {t('newEntry')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportScreen;
