import { useState } from "react";
import { UseRoleSelectionProps } from "../(models)/hook.types";

export const useRoleSelection = ({
  onRoleSelected,
}: UseRoleSelectionProps = {}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const confirmSelection = (): boolean => {
    if (selectedRole && onRoleSelected) {
      onRoleSelected(selectedRole);
      return true;
    }
    return false;
  };

  const resetSelection = () => {
    setSelectedRole(null);
  };

  const isRoleSelected = selectedRole !== null;

  return {
    selectedRole,
    handleRoleSelect,
    confirmSelection,
    resetSelection,
    isRoleSelected,
  };
};
