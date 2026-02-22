import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { supabase } from "@/src/lib/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useUserProfiles } from "../../../start/Auth/hooks/useUserProfiles";
import { useCurrentUser } from "../../hooks/useCurrentUser";

type ProfilesConfigScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ProfilesConfigScreen"
>;

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
  const [userRole, setUserRole] = useState<string | null>(null);

  // Obtener el rol del usuario actual
  useEffect(() => {
    const getUserRole = async () => {
      if (!currentUser) {
        setUserRole(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        if (!error && data) {
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error getting user role:", error);
      }
    };

    getUserRole();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchProfiles();
    }
  }, [currentUser, fetchProfiles]);

  // Refrescar perfiles cuando la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      if (currentUser) {
        fetchProfiles();
      }
    }, [currentUser, fetchProfiles]),
  );

  // Determinar si el botón "Añadir nuevo" debe estar habilitado
  const isAddButtonEnabled = useMemo(() => {
    // Si no hay usuario (invitado), el botón está activo
    if (!currentUser) {
      return true;
    }

    // Si el rol es "self", el botón está deshabilitado
    if (userRole === "self") {
      return false;
    }

    // Si el rol es diferente de "self", el botón está activo
    return true;
  }, [currentUser, userRole]);

  const handleAddProfile = useCallback(() => {
    // Si no hay usuario (invitado), redirige a UserType
    if (!currentUser) {
      navigation.navigate("UserType");
      return;
    }

    // Si hay usuario y el rol permite crear subcuentas
    // TODO: Implementar la navegación a la pantalla de creación de perfil
    navigation.navigate("UserType");
  }, [currentUser, navigation]);

  const handleProfilePress = useCallback(
    (profile: any) => {
      // TODO: Cambiar al perfil seleccionado
      console.log("Switch to profile:", profile.id);
    },
    [navigation],
  );

  const handleEditProfile = useCallback(
    (profile: any, event: any) => {
      event.stopPropagation();
      navigation.navigate("ProfileEdit", { profile });
    },
    [navigation],
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
    (profile: any, index: number) => (
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
          onPress={(event) => handleEditProfile(profile, event)}
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

  if (isLoadingUser || isLoadingProfiles) {
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
