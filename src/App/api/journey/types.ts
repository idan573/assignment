import { GQLTaskRoute } from 'App/api/task/types';

export type GQLUserProgress = Partial<{
  stepsHistory: string[];
  currentSteps: string[];
  levelsHistory: string[];
  currentChapter: string;
  recommendedChapter: string;
  currentLevel: string;
  levelStartTimestamp: string;
  isCanAdvanceLevel: boolean;
}>;

export type GQLUserResult = Partial<{
  userId: string;
  stepName: string;
  taskId: string;
  taskName: string;
  taskType: string;
  threadId: string;
}>;

export type GQLStep = Partial<{
  stepName: string;
  displayName: string;
  stepType: string;
  chapter: string;
  stepsDependsOn: string[];
  nextSteps: string[];
  priority: number;
  order: number;
  image: string;
  actionKey: string;
  attributesToDisplay: string[];
  isMandatory: boolean;
  isStart: boolean;
  isFinish: boolean;
  isNotNeedPayment: boolean;
  isNeedPayment: boolean;
  title: string;
  description: string;
  routes: GQLTaskRoute[];
  isStepAvailable: boolean;
  isStepInProgress: boolean;
  isStepDone: boolean;
}>;

export type GQLChapter = Partial<{
  chapterName: string;
  displayName: string;
  level: string;
  image: string;
  description: string;
  isCurrentChapter: boolean;
  order: number;
  steps: GQLStep[];
}>;

export type GQLLevel = Partial<{
  levelName: string;
  displayName: string;
  nextLevel: string;
  order: number;
  image: string;
  chapters: GQLChapter[];
}>;
