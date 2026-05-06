import { useEffect, useRef } from "react";
import { achievementTrackingService } from "../services/achievementTracking.service";

interface UseAchievementCelebrationParams {
  percent: number;
  routineId: number;
  onShowAchievement: () => void;
}

export const useAchievementCelebration = ({
  percent,
  routineId,
  onShowAchievement,
}: UseAchievementCelebrationParams) => {
  const hasShownAchievement = useRef(false);
  const isShowingRef = useRef(false);
  const lastRoutineId = useRef<number>(0);

  useEffect(() => {
    if (isShowingRef.current) {
      return;
    }

    if (lastRoutineId.current !== routineId) {
      hasShownAchievement.current = false;
      lastRoutineId.current = routineId;
    }

    const checkAndShowAchievement = async () => {
      if (percent >= 100 && !hasShownAchievement.current && routineId > 0) {
        isShowingRef.current = true;

        const achievementId =
          achievementTrackingService.getRoutineAchievementId(routineId);

        const alreadyShown =
          await achievementTrackingService.hasBeenShown(achievementId);

        if (!alreadyShown) {
          hasShownAchievement.current = true;
          await achievementTrackingService.markAsShown(achievementId);

          setTimeout(() => {
            onShowAchievement();
          }, 100);
        } else {
          isShowingRef.current = false;
        }
      }
    };

    checkAndShowAchievement();
  }, [percent, routineId, onShowAchievement]);
};
