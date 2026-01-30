import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import AddButton from "../../components/AddButton";
import ListItem from "../../components/ListItem";
import SaveButton from "../../components/SaveButton";

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
    contentContainer: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 120,
    },
    sectionTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: themedColors.text,
      textAlign: "center",
      marginBottom: 30,
    },
  });

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Medicaciones")} />

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("¿Tomas alguna medicación?")}
        </CustomText>

        <AddButton
          onPress={handleAddMedication}
          text={transformText("Añadir nuevo")}
        />

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
            <ListItem
              key={index}
              iconName="medical"
              title={parsed.name}
              subtitle={parsed.frequency}
              onPress={() => handleEditMedication(index)}
            />
          );
        })}
      </ScrollView>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default MedicationsScreen;
