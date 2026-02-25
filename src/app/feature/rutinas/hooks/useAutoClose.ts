import { useEffect } from "react";

export const useAutoClose = (
  visible: boolean,
  onClose: () => void,
  delay: number = 3000,
) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose, delay]);
};
