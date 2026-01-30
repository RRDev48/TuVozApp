import CustomText from "@/src/app/components/CustomText";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import BackButton from "../../../components/BackButton";
import ScreenTitle from "../../../components/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";

type NotesScreenRouteProp = RouteProp<RootStackParamsList, "NotesSelection">;
type NotesScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "NotesSelection"
>;

const NotesScreen = () => {
  const navigation = useNavigation<NotesScreenNavigationProp>();
  const route = useRoute<NotesScreenRouteProp>();
  const { getThemedColors, transformText } = usePersonalization();
  const themedColors = getThemedColors();

  const [notes, setNotes] = useState(route.params?.currentNotes || "");

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(notes);
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
      fontSize: 18,
      fontWeight: "bold",
      color: themedColors.text,
      marginBottom: 15,
    },
  });

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Notas")} />

      <ScrollView style={styles.contentContainer}>
        <CustomText style={styles.sectionTitle}>
          {transformText("Información adicional")}
        </CustomText>

        <ThemedTextInput
          placeholder={transformText("Escribe notas adicionales...")}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={10}
          minHeight={200}
        />
      </ScrollView>

      <SaveButton onPress={handleSave} />
    </View>
  );
};

export default NotesScreen;
