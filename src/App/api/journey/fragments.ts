import { taskRoute } from 'App/api/task/fragments';

export const userProgressFragment = `{
  stepsHistory
  currentSteps
  levelsHistory
  currentChapter
  recommendedChapter
  currentLevel
  levelStartTimestamp
  isCanAdvanceLevel
}`;

export const userResultFragment = `{
  userId
  stepName
  taskId
  taskName
  taskType
  threadId
}`;

export const stepFragment = `{
  stepName
  displayName
  stepType
  chapter
  stepsDependsOn
  nextSteps
  priority
  order
  image
  actionKey
  attributesToDisplay
  isMandatory
  isStart
  isFinish
  isNotNeedPayment
  isNeedPayment
  title
  description
  routes ${taskRoute}
  isStepAvailable
  isStepInProgress
  isStepDone
}`;

export const chapterFragment = `{
  chapterName
  displayName
  level
  image
  description
  isCurrentChapter
  order
  steps ${stepFragment}
}`;

export const levelFragment = `{
  levelName
  displayName
  nextLevel
  order
  image
  chapters ${chapterFragment}
}`;
