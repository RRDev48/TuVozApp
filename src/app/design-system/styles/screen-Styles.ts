import { StyleSheet } from "react-native";
import { colors } from "../themes/globalColors-theme";

export const homeScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  iconContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.blue,
  },

  textContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  greetingText: {
    fontSize: 24,
    color: colors.black,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export const communicateScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.black,
  },

  searchInput: {
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  createButton: {
    backgroundColor: colors.blue,
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 70,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
});

export const cardScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 50,
  },
});

export const shortcutScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.black,
  },

  searchInput: {
    height: 50,
    backgroundColor: colors.blue,
    borderRadius: 30,
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
});

export const routineScreenStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
    paddingTop: 5,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 5,
    zIndex: 10,
    padding: 5,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.blue,
  },

  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  selectedDay: {
    width: "13%",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    minWidth: 50,
  },
  dayText: {
    fontSize: 14,
    textAlign: "center",
    width: "100%",
  },
  numberDayText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },

  hoursContainer: {
    flex: 1,
  },
  hourTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  hourText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: colors.blue,
  },
  hourTouchable: {
    width: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  taskList: {
    flex: 1,
    minHeight: 50,
    justifyContent: "center",
  },
  emptyTaskContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  emptyTaskText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },

  medalIcon: {
    width: 30,
    height: 30,
  },
});

export default {};
