import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import CustomText from "@/src/app/feature/common/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../design-system/themes/globalColors-theme";
import { BackButtonProps } from "./models/component.props";

const BackButton = ({
  onPress,
  disablePersonalization = false,
  disabled = false,
}: BackButtonProps) => {
  const { t } = useLanguageRefresh();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();

  const styles = StyleSheet.create({
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 10,
      opacity: disabled ? 0.5 : 1,
    },
    backText: {
      fontSize: 16,
      fontWeight: "bold",
      color: disablePersonalization ? colors.black : themedColors.text,
      marginLeft: 4,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.backButton}
      disabled={disabled}
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={disablePersonalization ? colors.black : themedColors.text}
      />
      {disablePersonalization ? (
        <Text style={styles.backText}>{t('back')}</Text>
      ) : (
        <CustomText style={styles.backText}>
          {t('back')}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

export default BackButton;
