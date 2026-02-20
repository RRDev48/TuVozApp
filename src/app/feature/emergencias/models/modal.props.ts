// Interfaces para modales específicos de emergencias
export interface CancelConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface EmergencySuccessModalProps {
  visible: boolean;
  onClose: () => void;
}
