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
  const lastRoutineId = useRef<number>(0);

  useEffect(() => {
    // Reset si cambia la rutina
    if (lastRoutineId.current !== routineId) {
      hasShownAchievement.current = false;
      lastRoutineId.current = routineId;
    }

    const checkAndShowAchievement = async () => {
      if (percent >= 100 && !hasShownAchievement.current && routineId > 0) {
        const achievementId =
          achievementTrackingService.getRoutineAchievementId(routineId);

        // Verificar si ya fue mostrado anteriormente
        const alreadyShown =
          await achievementTrackingService.hasBeenShown(achievementId);

        if (!alreadyShown) {
          hasShownAchievement.current = true;

          // Marcar como mostrado antes de mostrar el modal
          await achievementTrackingService.markAsShown(achievementId);

          setTimeout(() => {
            onShowAchievement();
          }, 100);
        }
      }
    };

    checkAndShowAchievement();
  }, [percent, routineId, onShowAchievement]);
};
