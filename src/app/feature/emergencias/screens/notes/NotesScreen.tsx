import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import RootStackParamsList from "@/src/app/navigation/navigation.types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import BackButton from "../../../common/BackButton";
import ScreenTitle from "../../../common/ScreenTitle";
import SaveButton from "../../components/SaveButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useKeyboardVisibility } from "../../hooks/useKeyboardVisibility";

type NotesScreenRouteProp = RouteProp<RootStackParamsList, "NotesSelection">;
type NotesScreenNavigationProp = StackNavigationProp<
  RootStackParamsList,
  "NotesSelection"
>;

const NotesScreen = () => {
  const navigation = useNavigation<NotesScreenNavigationProp>();
  const route = useRoute<NotesScreenRouteProp>();
  const { transformText, getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const isKeyboardVisible = useKeyboardVisibility();

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
          marginBottom: 20,
          textAlign: "center",
        },
      }),
    [themedColors],
  );

  const [notes, setNotes] = useState(route.params?.currentNotes || "");

  const handleSave = () => {
    if (route.params?.onSelect) {
      route.params.onSelect(notes);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackButton onPress={() => navigation.goBack()} />

      <ScreenTitle text={transformText("Notas")} />

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>
          {transformText("Información adicional")}
        </Text>

        <ThemedTextInput
          placeholder={transformText("Escribe notas adicionales...")}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={10}
          minHeight={200}
        />
      </ScrollView>

      <SaveButton onPress={handleSave} bottom={isKeyboardVisible ? 300 : 40} />
    </KeyboardAvoidingView>
  );
};

export default NotesScreen;
