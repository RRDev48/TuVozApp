import { useState } from "react";
import type { RoleId } from "../constants/roles";
import { UseRoleSelectionProps } from "../models/auth.props";

export const useRoleSelection = ({
  onRoleSelected,
}: UseRoleSelectionProps = {}) => {
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);

  const handleRoleSelect = (roleId: RoleId) => {
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
