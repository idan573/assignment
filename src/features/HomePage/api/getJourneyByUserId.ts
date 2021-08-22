/* Types */
import {
  Chapter,
  Journey,
  Level,
  Step,
  STEP_STATUS,
  UserProgress
} from 'App/types';

/* Api */
import { retrieveJourneyQuery } from 'App/api/journey/retrieveUserJourney';
import { getUserProgressQuery } from 'App/api/journey/getUserProgress';

export type GetJourneyByUserIdVars = {
  userId: string;
};

export const getJourneyByUserId = async ({
  userId
}: GetJourneyByUserIdVars): Promise<Journey> => {
  const journey =
    (await retrieveJourneyQuery({
      userId
    })) || [];

  const userProgress =
    (await getUserProgressQuery({
      userId: userId || 'public'
    })) || {};

  updateLevelIndex(journey, userProgress);

  const levels = journey.map((level, index) =>
    getLevelStatus(level, index, userProgress)
  );

  return {
    levels,
    userProgress
  };
};

const isStepReady = (step: Step, progress: UserProgress) => {
  if (!step) {
    return;
  }

  const { isStart, stepsDependsOn: dependsOn } = step;
  if (isStart || !dependsOn) {
    return true;
  }

  const done = dependsOn.reduce((arr, dependency) => {
    if (progress?.stepsHistory?.find(stepName => stepName === dependency)) {
      arr.push(dependency);
      return arr;
    }
  }, []);

  return done?.length === dependsOn.length;
};

const updateStepStatus = (
  step: Step,
  levelIndex: number,
  progress: UserProgress
) => {
  if (
    levelIndex <= progress?.currentLevelIndex &&
    progress?.stepsHistory?.find(stepName => stepName === step.stepName)
  ) {
    step.status = STEP_STATUS.DONE;
    return;
  }

  if (
    levelIndex <=
      progress?.currentLevelIndex /*I can be in next level put some steps are in progress*/ &&
    !!progress?.currentSteps?.find(stepName => stepName === step.stepName)
  ) {
    step.status = STEP_STATUS.IN_PROGRESS;
    return;
  }

  if (isStepReady(step, progress)) {
    step.status = STEP_STATUS.READY;
    return;
  }

  step.status = STEP_STATUS.BLOCKED;
};

const isLevelOpen = (index: number, progress: UserProgress): boolean => {
  if (!progress?.currentLevel && index === 0) {
    return true;
  }

  if (index <= progress?.currentLevelIndex) {
    return true;
  }

  return progress?.isCanAdvanceLevel;
};

const getLevelStatus = (
  level: Level,
  index: number,
  progress: UserProgress
): Level => {
  level.chapters.forEach(chapter => {
    if (!chapter?.steps) {
      return level;
    }

    level.isOpen = isLevelOpen(index, progress);

    if (progress?.recommendedChapter === chapter?.chapterName) {
      chapter.isRecommended = true;
    }

    if (
      level.levelName !== progress.currentLevel &&
      level.levelName !== 'level1'
    ) {
      return;
    }

    chapter.steps.forEach(step => updateStepStatus(step, index, progress));
  });

  return level;
};

const updateLevelIndex = (levels: Level[], progress: UserProgress) => {
  levels.forEach((level, index) => {
    if (level.levelName === progress.currentLevel) {
      progress.currentLevelIndex = index;
    }
  });
};
