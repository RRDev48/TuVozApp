import { useEffect, useRef } from "react";

interface UseAchievementCelebrationParams {
  percent: number;
  onShowAchievement: () => void;
}

export const useAchievementCelebration = ({
  percent,
  onShowAchievement,
}: UseAchievementCelebrationParams) => {
  const hasShownAchievement = useRef(false);

  useEffect(() => {
    if (percent >= 100 && !hasShownAchievement.current) {
      hasShownAchievement.current = true;
      setTimeout(() => {
        onShowAchievement();
      }, 100);
    }

    if (percent < 100) {
      hasShownAchievement.current = false;
    }
  }, [percent, onShowAchievement]);
};
