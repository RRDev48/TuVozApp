import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { supabase } from "@/src/lib/supabaseClient";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import ConfirmationModal from "../../../common/alerts/ConfirmationModal";
import ErrorModal from "../../../common/alerts/ErrorModal";
import SuccessModal from "../../../common/alerts/SuccessModal";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import { useUserProfiles } from "../../../start/Auth/hooks/useUserProfiles";

type ProfileEditScreenRouteProp = RouteProp<RootStackParamsList, "ProfileEdit">;
type ProfileEditScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "ProfileEdit"
>;

const ProfileEditScreen = () => {
  const navigation = useNavigation<ProfileEditScreenNavigationProp>();
  const route = useRoute<ProfileEditScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const { updateProfile } = useUserProfiles();

  const [fullName, setFullName] = useState(route.params.profile.full_name);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = useCallback(async () => {
    if (!fullName.trim()) {
      setErrorMessage("Por favor ingrese un nombre");
      setShowError(true);
      return;
    }

    try {
      const profileId = route.params.profile.id;
      const newName = fullName.trim();

      // 1. Obtener el user_id asociado al perfil y su rol
      const { data: userProfileData, error: userProfileError } = await supabase
        .from("user_profiles")
        .select("user_id, users(role)")
        .eq("profile_id", profileId)
        .eq("is_owner", true)
        .single();

      if (userProfileError) {
        console.error("Error getting user profile:", userProfileError);
        setErrorMessage("Error al obtener información del perfil");
        setShowError(true);
        return;
      }

      const userId = userProfileData.user_id;
      const userRole = (userProfileData.users as any)?.role;

      // 2. Actualizar siempre la tabla profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", profileId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        setErrorMessage("Error al actualizar el perfil");
        setShowError(true);
        return;
      }

      // 3. Si el rol es "self", también actualizar la tabla users
      if (userRole === "self") {
        const { error: userError } = await supabase
          .from("users")
          .update({ full_name: newName })
          .eq("id", userId);

        if (userError) {
          console.error("Error updating user:", userError);
          setErrorMessage("Error al actualizar el usuario");
          setShowError(true);
          return;
        }
      }

      // 4. Actualizar los perfiles en el hook para refrescar la lista
      await updateProfile(profileId, { full_name: newName });

      setShowSuccess(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error("Error in handleSave:", error);
      setErrorMessage("Error al actualizar el perfil");
      setShowError(true);
    }
  }, [fullName, route.params.profile.id, updateProfile, navigation]);

  const handleDelete = useCallback(() => {
    setShowConfirmDelete(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    setShowConfirmDelete(false);

    try {
      const profileId = route.params.profile.id;
      console.log("🔴 INICIO DELETE - Profile ID:", profileId);

      // 1. Obtener el user_id asociado al perfil y su rol
      console.log("📋 Paso 1: Obteniendo user_id y rol...");
      const { data: userProfileData, error: userProfileError } = await supabase
        .from("user_profiles")
        .select("user_id, users(role)")
        .eq("profile_id", profileId)
        .eq("is_owner", true)
        .single();

      if (userProfileError) {
        console.error("❌ Error getting user profile:", userProfileError);
        setErrorMessage("Error al obtener información del perfil");
        setShowError(true);
        return;
      }

      const userId = userProfileData.user_id;
      const userRole = (userProfileData.users as any)?.role;
      console.log("✅ User ID:", userId);
      console.log("✅ User Role:", userRole);

      if (userRole === "self") {
        console.log("🎯 ROL SELF - Llamando RPC delete_all_user_data");

        // Llamar a la función RPC que elimina TODO
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          "delete_all_user_data",
        );

        console.log("🔍 Resultado RPC:", { data: rpcResult, error: rpcError });

        if (rpcError) {
          console.error("❌ Error en RPC delete_all_user_data:", rpcError);
          setErrorMessage("Error al eliminar todos los datos del usuario");
          setShowError(true);
          return;
        }

        console.log("✅ Datos eliminados exitosamente:", rpcResult);

        // Cerrar sesión del usuario actual
        console.log("📋 Cerrando sesión...");
        await supabase.auth.signOut();
        console.log("✅ Sesión cerrada");

        console.log("🎉 ELIMINACIÓN COMPLETADA - Redirigiendo a Onboarding");
        navigation.reset({
          index: 0,
          routes: [{ name: "Onboarding" }],
        });
      } else {
        console.log(
          "🎯 ROL DIFERENTE A SELF - Llamando RPC delete_single_profile",
        );

        // Llamar a la función RPC que elimina el perfil específico
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          "delete_single_profile",
          { p_profile_id: profileId },
        );

        console.log("🔍 Resultado RPC:", { data: rpcResult, error: rpcError });

        if (rpcError) {
          console.error("❌ Error en RPC delete_single_profile:", rpcError);
          setErrorMessage("Error al eliminar el perfil");
          setShowError(true);
          return;
        }

        console.log("✅ Perfil eliminado exitosamente:", rpcResult);

        // Si se eliminó también el usuario (era la última cuenta), cerrar sesión
        if (rpcResult?.deleted_user) {
          console.log("📋 Era la última cuenta - Cerrando sesión...");
          await supabase.auth.signOut();
          console.log("✅ Sesión cerrada");

          console.log("🎉 ELIMINACIÓN COMPLETADA - Redirigiendo a Onboarding");
          navigation.reset({
            index: 0,
            routes: [{ name: "Onboarding" }],
          });
        } else {
          console.log("✅ No era la última cuenta - Regresando");
          navigation.goBack();
        }
      }
    } catch (error: any) {
      console.error("❌ ERROR GENERAL in confirmDelete:", error);
      setErrorMessage("Error al eliminar el perfil");
      setShowError(true);
    }
  }, [route.params.profile.id, navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: themedColors.background,
        },
        headerContainer: {
          paddingHorizontal: 20,
          marginBottom: 40,
        },
        contentContainer: {
          flex: 1,
          paddingHorizontal: 20,
        },
        title: {
          fontSize: 32,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 40,
        },
        fieldLabel: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          marginBottom: 10,
        },
        input: {
          backgroundColor: themedColors.cardBackground,
          borderRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 20,
          fontSize: 16,
          color: themedColors.background,
          marginBottom: 30,
        },
        buttonContainer: {
          position: "absolute",
          bottom: 100,
          left: 20,
          right: 20,
        },
        continueButton: {
          backgroundColor: colors.green,
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
        },
        continueButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.white,
        },
        deleteButton: {
          position: "absolute",
          bottom: 28,
          left: 20,
          right: 20,
          backgroundColor: "transparent",
          paddingVertical: 18,
          borderRadius: 16,
          alignItems: "center",
          borderWidth: 2,
          borderColor: colors.red,
        },
        deleteButtonText: {
          fontSize: 18,
          fontWeight: "bold",
          color: colors.red,
        },
      }),
    [themedColors],
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.headerContainer}>
        <ScreenTitle text={transformText("Configurando cuenta")} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {transformText("¡Vamos a conocernos!")}
        </Text>

        <Text style={styles.fieldLabel}>
          {transformText("Nombre completo")}
        </Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder={transformText("Ingresa el nombre")}
          placeholderTextColor={`${themedColors.background}80`}
        />
      </View>

      {/* Botón Continuar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {transformText("Continuar")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón Eliminar perfil */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteButtonText}>
          {transformText("Eliminar perfil")}
        </Text>
      </TouchableOpacity>

      <ErrorModal
        visible={showError}
        title="Error"
        message={errorMessage}
        onClose={() => setShowError(false)}
      />

      <SuccessModal
        visible={showSuccess}
        title="Éxito"
        message="Perfil actualizado correctamente"
        onClose={() => setShowSuccess(false)}
      />

      <ConfirmationModal
        visible={showConfirmDelete}
        title="¿Estás seguro de que deseas eliminar este perfil?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
      />
    </View>
  );
};

export default ProfileEditScreen;
