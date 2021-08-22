/* Types */
import {
  UserProgress,
  UserResult,
  Step,
  STEP_TYPE,
  STEP_STATUS,
  Chapter,
  Level
} from 'App/types';
import {
  GQLUserProgress,
  GQLUserResult,
  GQLStep,
  GQLChapter,
  GQLLevel
} from './types';

/* Mappers */
import { taskRouteMapper } from 'App/api/task/mappers';

export const sortByOrder = (a, b) => a?.order - b?.order;

export const userProgressMapper = ({
  currentChapter,
  recommendedChapter,
  ...gqlUserProgress
}: GQLUserProgress = {}): UserProgress => {
  return {
    ...gqlUserProgress,
    currentChapter,
    recommendedChapter: recommendedChapter || currentChapter
  };
};

export const userResultMapper = ({
  ...gqlUserResult
}: GQLUserResult = {}): UserResult => {
  return {
    ...gqlUserResult
  };
};

export const stepMapper = ({
  stepType,
  routes,
  isNotNeedPayment,
  ...gqlStep
}: GQLStep = {}): Step => {
  return {
    ...gqlStep,
    stepType: stepType as STEP_TYPE,
    status: STEP_STATUS.NONE,
    isFree: isNotNeedPayment,
    routes: routes?.map(taskRouteMapper) ?? []
  };
};

export const chapterMapper = ({
  steps,
  ...gqlChapter
}: GQLChapter = {}): Chapter => {
  return {
    ...gqlChapter,
    steps: steps?.map(stepMapper)?.sort(sortByOrder) ?? [],
    isRecommended: false
  };
};

export const levelMapper = ({
  chapters,
  ...gqlLevel
}: GQLLevel = {}): Level => {
  return {
    ...gqlLevel,
    chapters: chapters?.map(chapterMapper) ?? [],
    isOpen: false
  };
};
