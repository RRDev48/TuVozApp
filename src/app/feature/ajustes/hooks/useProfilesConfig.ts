import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { supabase } from "@/src/lib/supabaseClient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useCallback, useEffect, useMemo, useState } from "react";

type ProfilesConfigScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ProfilesConfigScreen"
>;

interface CurrentUser {
  id: string;
  [key: string]: any;
}

export const useProfilesConfig = (currentUser: CurrentUser | null) => {
  const navigation = useNavigation<ProfilesConfigScreenNavigationProp>();
  const [userRole, setUserRole] = useState<string | null>(null);
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
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error getting user role:", error);
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

  const handleProfilePress = useCallback((profile: any) => {
    // TODO: Cambiar al perfil seleccionado
    console.log("Switch to profile:", profile.id);
  }, []);

  const handleEditProfile = useCallback(
    (profile: any, event?: any) => {
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
