import { TaskRoute } from 'App/types';

export type UserProgress = Partial<{
  stepsHistory: string[];
  currentSteps: string[];
  levelsHistory: string[];
  currentChapter: string;
  recommendedChapter: string;
  currentLevel: string;
  levelStartTimestamp: string;
  isCanAdvanceLevel: boolean;

  currentLevelIndex: number;
}>;

export type UserResult = Partial<{
  userId: string;
  stepName: string;
  taskId: string;
  taskName: string;
  taskType: string;
  threadId: string;
}>;

export enum STEP_TYPE {
  TASK = 'taskStep',
  FORM = 'formStep',
  TASK_ROUTE = 'taskRoutingStep'
}

export enum STEP_STATUS {
  NONE = 'None',
  READY = 'Ready',
  IN_PROGRESS = 'InProgress',
  DONE = 'Done',
  BLOCKED = 'Blocked'
}

export type Step = Partial<{
  status: STEP_STATUS;
  isFree: boolean;

  stepName: string;
  displayName: string;
  stepType: STEP_TYPE;
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
  isNeedPayment: boolean;
  title: string;
  description: string;
  routes: TaskRoute[];
  isStepAvailable: boolean;
  isStepInProgress: boolean;
  isStepDone: boolean;
}>;

export enum CHAPTER_STATUS {
  NONE = 'CHAPTER_NONE',
  BLOCKED = 'CHAPTER_BLOCKED',
  CONTINUE = 'CHAPTER_CONTINUE',
  IN_PROGRESS = 'CHAPTER_IN_PROGRESS',
  DONE = 'CHAPTER_DONE'
}

export type Chapter = Partial<{
  isRecommended: boolean;

  chapterName: string;
  displayName: string;
  level: string;
  image: string;
  description: string;
  isCurrentChapter: boolean;
  order: number;
  steps: Step[];
}>;

export type Level = Partial<{
  isOpen: boolean;

  levelName: string;
  displayName: string;
  nextLevel: string;
  order: number;
  image: string;
  chapters: Chapter[];
}>;

export type Journey = Partial<{
  levels: Level[];
  userProgress: UserProgress;
}>;
