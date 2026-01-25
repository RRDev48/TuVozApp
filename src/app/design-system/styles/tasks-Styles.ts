import { StyleSheet } from "react-native";
import { colors } from "../themes/globalColors-theme";

export const addTaskStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  addTaskModalContainer: {
    width: "90%",
    height: "90%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },

  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  inputTitleTask: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.black,

    borderBottomWidth: 10,
    borderColor: colors.lightGray,
    borderRadius: 40,
    padding: 10,
    marginVertical: 10,
    width: "90%",
  },

  dataFields: {
    flexDirection: "row",
    alignItems: "center",
  },
  datetButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  dateTextButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,

    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.blue,
    borderBottomWidth: 1,
    borderColor: colors.lightGray,
    padding: 10,
    marginVertical: 10,
    width: "90%",
    marginLeft: 10,
  },

  categoryField: {
    width: "100%",
    marginBottom: 20,
  },

  categoryButtonText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: "bold",
  },

  categoryButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  mainStepsContainer: {
    width: "100%",
    flex: 1,
  },

  stepsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.blue,
    borderColor: colors.blue,
  },

  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  stepsList: {
    marginVertical: 10,
    maxHeight: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },

  stepNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
    color: colors.blue,
  },

  stepsInput: {
    fontSize: 18,
    fontWeight: "bold",
    borderWidth: 1,
    color: colors.blue,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    borderColor: colors.darkGray,
    marginVertical: 10,
    width: "90%",
  },

  calendarContainer: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.blue,
  },

  sharedModalContainer: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  reminderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.blue,
  },

  timePickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: colors.blue,
  },

  categoryTitle: {
    paddingTop: 40,
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: colors.blue,
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  switchTextContainer: {
    flex: 1,
    marginTop: 20,
  },

  switchTitleLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.blue,
  },

  switchSubTitleLabel: {
    fontSize: 14,
    color: colors.blue,
    marginBottom: 5,
  },

  switch: {
    marginLeft: 10,
  },

  timePickerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },

  timePickerPeriodText: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: colors.blue,
  },

  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
  },

  textInputLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.blue,
    marginRight: 10,
  },

  textTimeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.darkGray,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    color: colors.blue,
  },

  optionsContainer: {
    width: "100%",
    marginBottom: 20,
  },

  optionButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },

  optionText: {
    color: colors.blue,
    fontWeight: "bold",
  },

  selectedOption: {
    backgroundColor: colors.blue,
  },

  selectedOptionText: {
    color: "white",
  },

  createTaskButton: {
    position: "absolute",
    top: 5,
    left: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    padding: 10,
  },

  createTaskButtonText: {
    color: colors.blue,
    fontSize: 20,
    fontWeight: "bold",
  },

  createTaskButtonDisabled: {
    backgroundColor: colors.white,
  },

  closeWhitTextButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },

  closeWhitTextButtonText: {
    color: colors.white,
    fontWeight: "bold",
  },

  closeXButton: {
    position: "absolute",
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 5,
  },

  closeXButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.red,
  },

  addStepButton: {
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  addStepButtonText: {
    color: colors.white,
    fontSize: 24,
  },

  removeStepButton: {
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  setReminderButton: {
    marginTop: 20,
    backgroundColor: colors.blue,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  setReminderButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export const taskDetailsStyles = StyleSheet.create({
  detailsOverlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },

  taskDetailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.blue,
    marginBottom: 10,
  },

  taskDateDetailsText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.darkGray,
    marginBottom: 20,
  },

  stepsContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  stepItem: {
    backgroundColor: colors.blue,
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },

  stepText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },

  startTaskButton: {
    backgroundColor: "#8BC34A",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    width: "90%",
  },

  startTaskButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const taskStepsStyles = StyleSheet.create({
  detailsOverlay: {
    flex: 1,
    backgroundColor: colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },

  detailsContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },

  titleTaskContainer: {
    alignItems: "center",
    marginBottom: 10,
  },

  taskDetailsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.blue,
  },

  stepContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  taskStepText: {
    fontSize: 24,
    color: colors.blue,
    textAlign: "center",
    fontWeight: "bold",
    padding: 10,
    marginBottom: 50,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  backButton: {
    flex: 1,
    backgroundColor: colors.red,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 5,
  },

  nextButton: {
    flex: 1,
    backgroundColor: colors.green,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 5,
  },

  disabledButton: {
    backgroundColor: colors.lightGray,
    opacity: 0.5,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export const taskItemStyles = StyleSheet.create({
  taskInfoContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderLeftWidth: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.5,
    elevation: 5,
  },

  taskTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },

  taskDataContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },

  titleAndStepsContainer: {
    flexDirection: "column",
    flex: 1,
    padding: 10,
  },

  categoryDataContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  stepsDataText: {
    fontSize: 18,
    color: colors.black,
    fontWeight: "bold",
  },
});

export default {};
