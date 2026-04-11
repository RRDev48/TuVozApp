import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useUserProfiles } from "../../../start/Auth/hooks/useUserProfiles";
import type { Profile } from "../../../common/models/database.types";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useProfilesConfig } from "../../hooks/useProfilesConfig";

type ProfilesConfigScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ProfilesConfigScreen"
>;

type ProfileWithOwner = Profile & { is_owner: boolean };

const ProfilesConfigScreen = () => {
  const navigation = useNavigation<ProfilesConfigScreenNavigationProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const {
    profiles,
    loading: isLoadingProfiles,
    fetchProfiles,
  } = useUserProfiles();

  const {
    isLoadingRole,
    isAddButtonEnabled,
    handleAddProfile,
    handleProfilePress,
    handleEditProfile,
  } = useProfilesConfig(currentUser);

  useEffect(() => {
    if (currentUser) {
      fetchProfiles();
    }
  }, [currentUser, fetchProfiles]);

  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        fetchProfiles();
      }
    }, [currentUser, fetchProfiles]),
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
        },
        profilesList: {
          gap: 16,
        },
        profileCard: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 20,
          padding: 16,
          flexDirection: "row",
          alignItems: "center",
        },
        avatarContainer: {
          width: 60,
          height: 60,
          borderRadius: 15,
          backgroundColor: themedColors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        },
        avatarImage: {
          width: 45,
          height: 45,
        },
        profileInfo: {
          flex: 1,
        },
        profileName: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.background,
        },
        chevronIcon: {
          marginLeft: 10,
        },
        eyeIcon: {
          marginLeft: 10,
          marginRight: 10,
        },
        addButtonContainer: {
          position: "absolute",
          bottom: 28,
          left: 20,
          right: 20,
        },
        addButton: {
          borderWidth: 3,
          borderStyle: "dashed",
          borderColor: themedColors.text,
          borderRadius: 16,
          paddingVertical: 18,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 10,
          opacity: 1,
        },
        addButtonDisabled: {
          opacity: 0.3,
        },
        addButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        emptyContainer: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 100,
        },
        emptyText: {
          fontSize: 16,
          color: themedColors.text,
          opacity: 0.6,
          textAlign: "center",
        },
        editIconButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginLeft: 8,
        },
      }),
    [themedColors],
  );

  const renderProfile = useCallback(
    (profile: ProfileWithOwner, index: number) => (
      <TouchableOpacity
        key={profile.id || index}
        style={styles.profileCard}
        onPress={() => handleProfilePress(profile)}
        activeOpacity={0.8}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../../../assets/image/adip_icon.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.full_name}</Text>
        </View>
        {index === 0 && (
          <Ionicons
            name="eye"
            size={24}
            color={themedColors.background}
            style={styles.eyeIcon}
          />
        )}
        <TouchableOpacity
          style={styles.editIconButton}
          onPress={(event: GestureResponderEvent) => {
            event.stopPropagation();
            handleEditProfile(profile, event);
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={themedColors.background}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [styles, themedColors, handleProfilePress, handleEditProfile],
  );

  if (isLoadingUser || isLoadingProfiles || isLoadingRole) {
    return (
      <View style={styles.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <ScreenTitle text={transformText("Mis perfiles personales")} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={themedColors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Mis perfiles personales")} />

      <View style={styles.contentContainer}>
        {profiles.length > 0 ? (
          <View style={styles.profilesList}>{profiles.map(renderProfile)}</View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {transformText(
                currentUser
                  ? "No tienes perfiles configurados"
                  : "Inicia sesión para ver tus perfiles",
              )}
            </Text>
          </View>
        )}
      </View>

      {/* Botón Añadir nuevo */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            !isAddButtonEnabled && styles.addButtonDisabled,
          ]}
          onPress={handleAddProfile}
          disabled={!isAddButtonEnabled}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
          <Text style={styles.addButtonText}>
            {transformText("Añadir nuevo")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfilesConfigScreen;
