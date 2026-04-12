import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import AddButton from "../../components/AddButton";
import ListItem from "../../components/ListItem";
import SaveButton from "../../components/SaveButton";

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
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

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
        sectionTitle: {
          fontSize: 18,
          fontWeight: "bold",
          color: themedColors.text,
          textAlign: "center",
          marginBottom: 30,
        },
      }),
    [themedColors],
  );

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

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Alergias")} />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {transformText("¿Tienes alguna alergia?")}
        </Text>

        <AddButton
          onPress={handleAddAllergy}
          text={transformText("Añadir nuevo")}
        />

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
            <ListItem
              key={index}
              iconName="water"
              title={parsed.name}
              subtitle={parsed.severity}
              onPress={() => handleEditAllergy(index)}
            />
          );
        })}
      </ScrollView>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default AllergiesScreen;
