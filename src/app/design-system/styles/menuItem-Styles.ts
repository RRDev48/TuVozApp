import { StyleSheet } from "react-native";
import { colors } from "../themes/globalColors-theme";

export const tarjetaMenuItemStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    padding: 20,
  },

  buttonContainer: {
    width: 130,
    height: 130,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textCard: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
    marginTop: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export const communicateMenuItemStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  buttonContainer: {
    width: 130,
    height: 130,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textCard: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
    marginTop: 5,
  },
  icon: {
    width: 70,
    height: 70,
  },
});

export const homeMenuItemStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  buttonContainer: {
    width: 130,
    height: 130,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textCard: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
    marginTop: 5,
  },
  icon: {
    width: 70,
    height: 70,
  },
});

export const shortcutMenuItemStyles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  buttonContainer: {
    width: 130,
    height: 130,
    backgroundColor: colors.blue,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textCard: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,
    marginTop: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export const changeWeekStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
});

export default {};
