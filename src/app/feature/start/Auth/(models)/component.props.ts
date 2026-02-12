// Interfaces para componentes de alerts y modales de Auth
export interface RegisterSuccessAlertProps {
  visible: boolean;
  onClose: () => void;
}

export interface SuccessAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  onClose?: () => void;
}
