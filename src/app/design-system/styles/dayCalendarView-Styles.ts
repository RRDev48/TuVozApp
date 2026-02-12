import { StyleSheet } from "react-native";

const HOUR_HEIGHT = 60;
const QUARTER_HEIGHT = 15;

export const dayCalendarViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calendarContainer: {
    position: "relative",
    width: "100%",
  },
  hourBlockContainer: {
    position: "relative",
  },
  hourRow: {
    height: HOUR_HEIGHT,
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  quarterSpacer: {
    height: QUARTER_HEIGHT,
  },
  hourLabelContainer: {
    width: 60,
    paddingRight: 8,
    paddingTop: 2,
  },
  hourLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    fontWeight: "500",
  },
  hourLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  tasksContainer: {
    position: "absolute",
    left: 60,
    right: 0,
    top: 0,
    bottom: 0,
  },
  finalSpacer: {
    height: 50,
  },
});
