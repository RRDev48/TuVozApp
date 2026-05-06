import { useLanguageRefresh } from "@/src/app/contexts/useLanguageRefresh";
import { usePersonalization } from "@/src/app/contexts/PersonalizationContext";
import { colors } from "@/src/app/design-system/themes/globalColors-theme";
import ConfirmationModal from "@/src/app/feature/common/alerts/ConfirmationModal";
import SuccessModal from "@/src/app/feature/common/alerts/SuccessModal";
import { speakPictogramText } from "@/src/app/feature/expresate/services/speech.Service";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomText from "../../../common/CustomText";
import { useTaskStepModal } from "../../hooks/useTaskStepModal";
import { TaskStepModalProps } from "../../models/component.props";

export const TaskStepModal = ({
  visible,
  task,
  onClose,
  onRestart,
  updateTaskState,
}: TaskStepModalProps) => {
  const { t } = useLanguageRefresh();
  const { getThemedColors } = usePersonalization();
  const themedColors = getThemedColors();
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        detailsOverlay: {
          flex: 1,
          backgroundColor: colors.transparent,
          justifyContent: "center",
          alignItems: "center",
        },
        detailsContainer: {
          width: "90%",
          maxHeight: "75%",
          backgroundColor: themedColors.background,
          borderRadius: 20,
          padding: 20,
        },
        titleTaskContainer: {
          alignItems: "center",
          marginBottom: 20,
        },
        taskDetailsTitle: {
          fontSize: 22,
          fontWeight: "bold",
          color: themedColors.primary,
        },
        stepContainer: {
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 40,
          minHeight: 200,
        },
        taskStepText: {
          fontSize: 28,
          color: themedColors.primary,
          textAlign: "center",
          fontWeight: "bold",
          lineHeight: 38,
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
      }),
    [themedColors],
  );

  const { currentStepIndex, handleNextStep, handleBackStep, handleClose } =
    useTaskStepModal(
      task?.id,
      task?.pasos.length || 0,
      updateTaskState,
      onRestart,
      onClose,
    );

  // Leer el paso actual cuando cambie
  useEffect(() => {
    if (visible && task?.pasos[currentStepIndex]) {
      const timeout = setTimeout(() => {
        void speakPictogramText(task.pasos[currentStepIndex], "es", {
          interruptCurrent: true,
        });
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentStepIndex, visible, task?.pasos]);

  const handleCancelClick = () => {
    setShowConfirmCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmCancelModal(false);
    setTimeout(() => {
      if (task?.id) {
        updateTaskState(task.id, "En Proceso");
      }
      onRestart();
      onClose();
    }, 100);
  };

  const handleCancelCancel = () => {
    setShowConfirmCancelModal(false);
  };

  const handleStepAction = () => {
    if (currentStepIndex < (task?.pasos.length || 0) - 1) {
      handleNextStep();
    } else {
      if (task?.id) {
        updateTaskState(task.id, "Completado");
      }
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      onRestart();
      onClose();
    }, 300);
  };

  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.detailsOverlay}>
        <View style={styles.detailsContainer}>
          {/* Botón "X" de cierre en la esquina superior derecha */}
          <TouchableOpacity
            onPress={handleCancelClick}
            style={styles.closeXButton}
          >
            <Text style={styles.closeXButtonText}>×</Text>
          </TouchableOpacity>

          {/* Encabezado que muestra el número de paso actual y el total. */}
          <View style={styles.titleTaskContainer}>
            <CustomText style={styles.taskDetailsTitle}>
              {t('stepNumber', { current: currentStepIndex + 1, total: task.pasos.length })}
            </CustomText>
          </View>

          {/* Contenedor principal del texto del paso actual. */}
          <View style={styles.stepContainer}>
            <CustomText style={styles.taskStepText}>
              {task.pasos[currentStepIndex]}
            </CustomText>
          </View>

          {/* Contenedor de los botones de navegación entre pasos. */}
          <View style={styles.buttonContainer}>
            {/* Botón para volver al paso anterior. Se deshabilita cuando estamos
                en el primer paso (índice 0). */}
            <TouchableOpacity
              style={[
                styles.backButton,
                currentStepIndex === 0 && styles.disabledButton,
              ]}
              onPress={handleBackStep}
              disabled={currentStepIndex === 0}
            >
<CustomText style={styles.buttonText}>
                {t('backStep')}
              </CustomText>
            </TouchableOpacity>

            {/* Botón que avanza al siguiente paso o finalización de la tarea cuando
                ya estamos en el último paso. */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleStepAction}
            >
              <CustomText style={styles.buttonText}>
                {currentStepIndex < task.pasos.length - 1
                  ? t('nextStep')
                  : t('finishTask')}
              </CustomText>
            </TouchableOpacity>

            {/* Botón que avanza al siguiente paso o finaliza la tarea cuando
                ya estamos en el último paso. */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleStepAction}
            >
              <CustomText style={styles.buttonText}>
                {currentStepIndex < task.pasos.length - 1
                  ? t('nextStep')
                  : t('finishTask')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal de éxito que se muestra cuando la tarea se completa. */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={t('taskCompleted')}
        message={t('taskCompletedSuccess')}
      />

      {/* Modal de confirmación que aparece al intentar cerrar sin completar. */}
      <ConfirmationModal
        visible={showConfirmCancelModal}
        title={t('exitWithoutCompleting')}
        onConfirm={handleConfirmCancel}
        onCancel={handleCancelCancel}
      />
    </Modal>
  );
};

export default TaskStepModal;
