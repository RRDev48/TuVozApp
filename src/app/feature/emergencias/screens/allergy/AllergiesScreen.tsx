import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type AllergiesScreenRouteProp = RouteProp<
  RootStackParamsList,
  "AllergiesSelection"
>;

type AllergiesScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "AllergiesSelection"
>;

const AllergiesScreen = () => {
  const navigation = useNavigation<AllergiesScreenNavigationProp>();
  const route = useRoute<AllergiesScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [allergies, setAllergies] = useState<string[]>(
    route.params?.currentAllergies
      ? route.params.currentAllergies.split(",").map((a) => a.trim())
      : [],
  );

  const handleAddAllergy = () => {
    navigation.navigate("AddAllergy", {
      onAdd: (allergy: string) => {
        setAllergies([...allergies, allergy]);
      },
    });
  };

  const handleEditAllergy = (index: number) => {
    navigation.navigate("EditAllergy", {
      allergy: allergies[index],
      onUpdate: (updatedAllergy: string) => {
        const newAllergies = [...allergies];
        newAllergies[index] = updatedAllergy;
        setAllergies(newAllergies);
      },
      onDelete: () => {
        const newAllergies = allergies.filter((_, i) => i !== index);
        setAllergies(newAllergies);
      },
    });
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(allergies.join(", "));
    }
    navigation.goBack();
  };

  const styles = StyleSheet.create({
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
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      marginBottom: 30,
    },
    addButton: {
      width: "100%",
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: colors.white,
      borderRadius: 16,
      paddingVertical: 18,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.white,
    },
    allergiesList: {
      width: "100%",
    },
    allergyItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.darkGray,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 15,
    },
    allergyIcon: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.blue,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    allergyInfo: {
      flex: 1,
    },
    allergyName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.white,
      marginBottom: 4,
    },
    allergySeverity: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.white,
    },
    deleteButton: {
      padding: 5,
    },
    saveButton: {
      position: "absolute",
      bottom: 40,
      left: 20,
      right: 20,
      backgroundColor: colors.green,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonText: {
      color: colors.black,
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={themedColors.text} />
          <CustomText style={styles.backText}>
            {transformText("Atrás")}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <CustomText style={styles.headerTitle}>
          {transformText("Alergias")}
        </CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.title}>
          {transformText("¿Tienes alguna alergia?")}
        </CustomText>

        <TouchableOpacity style={styles.addButton} onPress={handleAddAllergy}>
          <CustomText style={styles.addButtonText}>
            + {transformText("Añadir nuevo")}
          </CustomText>
        </TouchableOpacity>

        <View style={styles.allergiesList}>
          {allergies.map((allergy, index) => {
            const parseAllergy = (allergyString: string) => {
              const match = allergyString.match(/^(.+)\s*\((.+)\)$/);
              if (match) {
                return { name: match[1].trim(), severity: match[2].trim() };
              }
              return { name: allergyString, severity: "" };
            };
            const parsed = parseAllergy(allergy);

            return (
              <TouchableOpacity
                key={index}
                style={styles.allergyItem}
                onPress={() => handleEditAllergy(index)}
              >
                <View style={styles.allergyIcon}>
                  <Ionicons name="water" size={30} color={colors.white} />
                </View>
                <View style={styles.allergyInfo}>
                  <CustomText style={styles.allergyName}>
                    {parsed.name}
                  </CustomText>
                  <CustomText style={styles.allergySeverity}>
                    {parsed.severity}
                  </CustomText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <CustomText style={styles.saveButtonText}>
          {transformText("Guardar cambios")}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default AllergiesScreen;
