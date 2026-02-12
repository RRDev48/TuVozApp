// React
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue, withSpring } from "react-native-reanimated";

// Componentes

// Constantes

// Modelos

// Hooks

// Servicios

// Acciones

// Visuales

// Altura mínima permitida para el bloque de tarea al redimensionar.
const MIN_TASK_HEIGHT = 60;
// Zona (en píxeles) desde el borde superior/inferior donde se considera
// que el usuario quiere redimensionar en lugar de mover.
const RESIZE_ZONE = 30;
// Umbral mínimo de movimiento para considerar que el gesto es drag y no un tap.
const MOVEMENT_THRESHOLD = 5;

// Parámetros necesarios para configurar los gestos de una tarea en el calendario.
interface UseTaskGesturesParams {
  hourHeight: number; // altura visual de una hora en el calendario
  initialTop: number; // posición vertical inicial del bloque
  initialHeight: number; // altura inicial del bloque
  onPositionChange: (newTop: number, newHeight: number) => void; // callback al soltar
  onPress: () => void; // callback al tocar (tap) la tarea
  setIsDragging: (value: boolean) => void; // notifica al componente padre si se está arrastrando
}

/**
 * Hook que encapsula toda la lógica de gestos (drag + resize) para una tarea
 * en el calendario diario.
 *
 * Expone valores animados (`translateY`, `taskHeight`) y un gesto compuesto
 * que combina arrastre y toque, de forma que:
 * - Si el usuario mueve por el centro, se desplaza la tarea en el tiempo.
 * - Si arrastra desde el borde superior/inferior, se redimensiona la duración.
 * - Al soltar, se hace snap a la rejilla (cuartos de hora) y se notifica el
 *   nuevo top/height al contenedor para actualizar el horario real.
 */
export const useTaskGestures = ({
  hourHeight,
  initialTop,
  initialHeight,
  onPositionChange,
  onPress,
  setIsDragging,
}: UseTaskGesturesParams) => {
  // Valores compartidos animados para posición vertical y altura de la tarea.
  const translateY = useSharedValue(initialTop);
  const taskHeight = useSharedValue(initialHeight);
  // Modo actual de gesto: mover, redimensionar desde arriba o desde abajo.
  const gestureMode = useSharedValue<"move" | "resize-top" | "resize-bottom">(
    "move",
  );
  // Valores de referencia al iniciar el gesto (top/height originales).
  const startHeight = useSharedValue(initialHeight);
  const startTop = useSharedValue(initialTop);
  // Indica si el movimiento ha superado el umbral para considerarse drag.
  const hasMovedThreshold = useSharedValue(false);

  // Ajusta un valor a la rejilla definida (por defecto, cuartos de hora).
  const snapToGrid = (value: number, gridSize: number = hourHeight / 4) => {
    "worklet";
    return Math.round(value / gridSize) * gridSize;
  };

  // Determina en qué zona del bloque se inició el toque: superior, inferior
  // o zona media, para decidir si el gesto será de resize o de movimiento.
  const getTouchZone = (y: number, taskHeightValue: number) => {
    "worklet";
    if (y < RESIZE_ZONE) return "top";
    if (y > taskHeightValue - RESIZE_ZONE) return "bottom";
    return "middle";
  };

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      // Avisamos al componente padre que comenzó un drag.
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
      // Hasta que el movimiento no supere el umbral, no se considera drag
      // (permite diferenciar entre un tap leve y un arrastre real).
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
        // Modo "move": se desplaza todo el bloque verticalmente, respetando
        // los límites del calendario (no salir por arriba o abajo).
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

      // Al finalizar el gesto, se deja de arrastrar y se notifica la nueva
      // posición y altura al contenedor para que actualice la tarea.
      runOnJS(setIsDragging)(false);
      runOnJS(onPositionChange)(translateY.value, taskHeight.value);
    });

  // Gesto de tap simple sobre la tarea, usado para abrir el detalle.
  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onPress)();
  });

  // Se combinan ambos gestos: si el usuario arrastra, gana el panGesture;
  // si solo toca, se dispara el tapGesture.
  const composedGesture = Gesture.Race(panGesture, tapGesture);

  return {
    translateY,
    taskHeight,
    composedGesture,
  };
};
