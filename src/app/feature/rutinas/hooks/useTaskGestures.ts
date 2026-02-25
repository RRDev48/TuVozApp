import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue, withSpring } from "react-native-reanimated";

const MIN_TASK_HEIGHT = 60;
const RESIZE_ZONE = 30;
const MOVEMENT_THRESHOLD = 5;

interface UseTaskGesturesParams {
  hourHeight: number;
  initialTop: number;
  initialHeight: number;
  onPositionChange: (newTop: number, newHeight: number) => void;
  onPress: () => void;
  setIsDragging: (value: boolean) => void;
}

export const useTaskGestures = ({
  hourHeight,
  initialTop,
  initialHeight,
  onPositionChange,
  onPress,
  setIsDragging,
}: UseTaskGesturesParams) => {
  const translateY = useSharedValue(initialTop);
  const taskHeight = useSharedValue(initialHeight);
  const gestureMode = useSharedValue<"move" | "resize-top" | "resize-bottom">(
    "move",
  );
  const startHeight = useSharedValue(initialHeight);
  const startTop = useSharedValue(initialTop);
  const hasMovedThreshold = useSharedValue(false);

  const snapToGrid = (value: number, gridSize: number = hourHeight / 4) => {
    "worklet";
    return Math.round(value / gridSize) * gridSize;
  };

  const getTouchZone = (y: number, taskHeightValue: number) => {
    "worklet";
    if (y < RESIZE_ZONE) return "top";
    if (y > taskHeightValue - RESIZE_ZONE) return "bottom";
    return "middle";
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      runOnJS(setIsDragging)(true);
      hasMovedThreshold.value = false;
      const zone = getTouchZone(event.y, taskHeight.value);
      if (zone === "top") {
        gestureMode.value = "resize-top";
      } else if (zone === "bottom") {
        gestureMode.value = "resize-bottom";
      } else {
        gestureMode.value = "move";
      }
      startHeight.value = taskHeight.value;
      startTop.value = translateY.value;
    })
    .onUpdate((event) => {
      if (!hasMovedThreshold.value) {
        const totalMovement = Math.abs(event.translationY);
        if (totalMovement < MOVEMENT_THRESHOLD) {
          return;
        }
        hasMovedThreshold.value = true;
      }

      const maxPosition = hourHeight * 24;

      if (gestureMode.value === "resize-top") {
        const delta = event.translationY;
        const newTop = Math.max(0, startTop.value + delta);
        const newHeight = startHeight.value + (startTop.value - newTop);

        if (newHeight >= MIN_TASK_HEIGHT && newTop >= 0) {
          translateY.value = newTop;
          taskHeight.value = newHeight;
        }
      } else if (gestureMode.value === "resize-bottom") {
        const newHeight = startHeight.value + event.translationY;
        const maxHeight = maxPosition - translateY.value;

        if (newHeight >= MIN_TASK_HEIGHT && newHeight <= maxHeight) {
          taskHeight.value = newHeight;
        }
      } else {
        const newY = startTop.value + event.translationY;
        const maxTop = maxPosition - taskHeight.value;

        if (newY >= 0 && newY <= maxTop) {
          translateY.value = newY;
        }
      }
    })
    .onEnd(() => {
      const maxPosition = hourHeight * 24;

      if (gestureMode.value === "resize-top") {
        const snappedY = Math.max(0, snapToGrid(translateY.value));
        const snappedHeight = snapToGrid(taskHeight.value);

        translateY.value = withSpring(snappedY, {
          damping: 20,
          stiffness: 300,
        });
        taskHeight.value = withSpring(
          Math.max(MIN_TASK_HEIGHT, snappedHeight),
          { damping: 20, stiffness: 300 },
        );
      } else if (gestureMode.value === "resize-bottom") {
        const snappedHeight = snapToGrid(taskHeight.value);
        const maxHeight = maxPosition - translateY.value;

        taskHeight.value = withSpring(
          Math.min(Math.max(MIN_TASK_HEIGHT, snappedHeight), maxHeight),
          { damping: 20, stiffness: 300 },
        );
      } else {
        const snappedY = snapToGrid(translateY.value);
        const maxTop = maxPosition - taskHeight.value;

        translateY.value = withSpring(Math.min(Math.max(0, snappedY), maxTop), {
          damping: 20,
          stiffness: 300,
        });
      }

      runOnJS(setIsDragging)(false);
      runOnJS(onPositionChange)(translateY.value, taskHeight.value);
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onPress)();
  });

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  return {
    translateY,
    taskHeight,
    composedGesture,
  };
};
