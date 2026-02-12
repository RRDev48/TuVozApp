import { StyleSheet } from "react-native";
import { colors } from "../themes/globalColors-theme";

export const personalizationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.black,
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.lightGray,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
  },
  fontSizeOptionsContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 10,
  },
  fontSizeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
  },
  fontSizeOptionSelected: {
    backgroundColor: colors.blue,
  },
  fontSizeOptionLabel: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
  },
  fontSizeOptionLabelSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: colors.white,
    backgroundColor: colors.white,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
});

export default personalizationStyles;
