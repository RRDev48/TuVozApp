export interface SuccessModalProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose: () => void;
  autoCloseDelay?: number;
  showDelay?: number;
  gifType?: "verificado" | "llave";
}

export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showDelay?: number;
  confirmDelay?: number;
}

export interface ErrorModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
  showDelay?: number;
  autoCloseDelay?: number;
  onDismiss?: () => void;
}
