import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

type MedicationsScreenRouteProp = RouteProp<
  RootStackParamsList,
  "MedicationsSelection"
>;

type MedicationsScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "MedicationsSelection"
>;

const MedicationsScreen = () => {
  const navigation = useNavigation<MedicationsScreenNavigationProp>();
  const route = useRoute<MedicationsScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [medications, setMedications] = useState<string[]>(
    route.params?.currentMedications
      ? route.params.currentMedications.split(",").map((m) => m.trim())
      : [],
  );

  const handleAddMedication = () => {
    navigation.navigate("AddMedication", {
      onAdd: (medication: string) => {
        setMedications((prev) => [...prev, medication]);
      },
    });
  };

  const handleEditMedication = (index: number) => {
    navigation.navigate("EditMedication", {
      medication: medications[index],
      onUpdate: (updatedMedication: string) => {
        setMedications((prev) => {
          const newMedications = [...prev];
          newMedications[index] = updatedMedication;
          return newMedications;
        });
      },
      onDelete: () => {
        setMedications((prev) => prev.filter((_, i) => i !== index));
      },
    });
  };

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(medications.join(", "));
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
    medicationsList: {
      width: "100%",
    },
    medicationItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.darkGray,
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginBottom: 15,
    },
    medicationIcon: {
      width: 60,
      height: 60,
      borderRadius: 12,
      backgroundColor: colors.blue,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    medicationInfo: {
      flex: 1,
    },
    medicationName: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.white,
      marginBottom: 4,
    },
    medicationFrequency: {
      fontSize: 14,
      fontWeight: "400",
      color: colors.white,
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
          {transformText("Medicaciones")}
        </CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.title}>
          {transformText("¿Tomas alguna medicación?")}
        </CustomText>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <CustomText style={styles.addButtonText}>
            + {transformText("Añadir nuevo")}
          </CustomText>
        </TouchableOpacity>

        <View style={styles.medicationsList}>
          {medications.map((medication, index) => {
            const parseMedication = (medicationString: string) => {
              const match = medicationString.match(/^(.+)\s*\((.+)\)$/);
              if (match) {
                return { name: match[1].trim(), frequency: match[2].trim() };
              }
              return { name: medicationString, frequency: "" };
            };
            const parsed = parseMedication(medication);

            return (
              <TouchableOpacity
                key={index}
                style={styles.medicationItem}
                onPress={() => handleEditMedication(index)}
              >
                <View style={styles.medicationIcon}>
                  <Ionicons name="medical" size={30} color={colors.white} />
                </View>
                <View style={styles.medicationInfo}>
                  <CustomText style={styles.medicationName}>
                    {parsed.name}
                  </CustomText>
                  <CustomText style={styles.medicationFrequency}>
                    {parsed.frequency}
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

export default MedicationsScreen;
