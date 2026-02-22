export interface UseCodeVerificationProps {
  codeLength?: number;
  onComplete?: (code: string) => void;
}

export interface UseRoleSelectionProps {
  onRoleSelected?: (roleId: string) => void;
}

export interface UseRegisterInfoProps {
  onValidationSuccess?: (data: { name: string }) => void;
}

export interface UsePasswordSetupProps {
  minLength?: number;
  onValidationSuccess?: (password: string) => void;
}

export interface UseOTPVerificationProps {
  email: string;
  onSuccess: () => void;
  userData?: {
    name: string;
    role: string;
    isOwner?: boolean;
    ownerUserId?: string;
  };
}

export interface UseEmailValidationProps {
  onValidationSuccess?: (email: string) => void;
}
