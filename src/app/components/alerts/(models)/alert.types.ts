// Interfaces para componentes de modal de éxito
export interface SuccessModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  autoCloseDelay?: number; // en milisegundos, default 3000
  showDelay?: number; // delay before showing modal (ms)
}

// Interfaces para componentes de modal de confirmación
export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showDelay?: number; // delay before showing modal (ms)
  confirmDelay?: number; // delay before executing confirm action (ms)
}

// Interfaces para componentes de modal de error
export interface ErrorModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttonText?: string;
  onClose: () => void;
  showDelay?: number; // delay before showing modal (ms)
  autoCloseDelay?: number; // auto close after delay (ms), 0 = no auto close
  onDismiss?: () => void; // callback when modal is dismissed (for additional logging)
}
