import RootStackParamsList from "@/src/app/navigation/navigation.types";
import type {
  Profile,
  UserRole,
} from "@/src/app/feature/common/models/database.types";
import { authService } from "@/src/app/feature/start/Auth/services/auth.Service";
import { supabase } from "@/src/lib/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useMemo, useState } from "react";

type ProfilesConfigScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ProfilesConfigScreen"
>;

type CurrentAuthUser = Awaited<ReturnType<typeof authService.getCurrentUser>>;
type ProfileWithOwner = Profile & { is_owner: boolean };

export const useProfilesConfig = (currentUser: CurrentAuthUser) => {
  const navigation = useNavigation<ProfilesConfigScreenNavigationProp>();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoadingRole, setIsLoadingRole] = useState(false);

  useEffect(() => {
    const getUserRole = async () => {
      if (!currentUser) {
        setUserRole(null);
        return;
      }

      setIsLoadingRole(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", currentUser.id)
          .single();

        if (!error && data) {
          setUserRole(data.role as UserRole);
        }
      } catch {
        setUserRole(null);
      } finally {
        setIsLoadingRole(false);
      }
    };

    getUserRole();
  }, [currentUser]);

  const isAddButtonEnabled = useMemo(() => {
    if (!currentUser) {
      return true;
    }

    if (userRole === "self") {
      return false;
    }

    return true;
  }, [currentUser, userRole]);

  const handleAddProfile = useCallback(() => {
    if (!currentUser) {
      navigation.navigate("UserType");
      return;
    }

    if (userRole && userRole !== "self") {
      navigation.navigate("RegisterInfo", {
        role: "self",
        isOwner: false,
        ownerUserId: currentUser.id,
      });
      return;
    }

    navigation.navigate("UserType");
  }, [currentUser, userRole, navigation]);

  const handleProfilePress = useCallback(
    (_profile: ProfileWithOwner) => {},
    [],
  );

  const handleEditProfile = useCallback(
    (profile: ProfileWithOwner, event?: { stopPropagation?: () => void }) => {
      if (event) {
        event.stopPropagation();
      }
      navigation.navigate("ProfileEdit", { profile });
    },
    [navigation],
  );

  return {
    userRole,
    isLoadingRole,
    isAddButtonEnabled,
    handleAddProfile,
    handleProfilePress,
    handleEditProfile,
  };
};
