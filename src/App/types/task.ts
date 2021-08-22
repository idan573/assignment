import { User, Stylist, Product, PRODUCT_CATEGORIES } from 'App/types';

export enum TASK_TYPE {
  SELECT_ONE_ITEM = 'SELECT_ONE_ITEM',
  REFINE_ITEM_SELECTION = 'REFINE_ITEM_SELECTION',
  SELECT_ONE_OUTFIT = 'SELECT_ONE_OUTFIT',
  IMAGE_FEEDBACK = 'IMAGE_FEEDBACK',
  ONE_ON_ONE_RESPONSE = 'ONE_ON_ONE_RESPONSE',
  USER_ANALYSIS = 'USER_ANALYSIS'
}

export enum ANALYSIS_STATEMENT_TYPE {
  IMAGE = 'image',
  TEXT = 'text'
}

export type AnalysisEntry = Partial<{
  entryName: string;
  attributeName: string;
  displayName: string;
  group: string;
  image: string;
  groupName: string;
  groupDisplayName: string;
  groupOrder: number;
  isChosen: boolean;
}>;

export type Statement = Partial<{
  priority: number;
  type: ANALYSIS_STATEMENT_TYPE;
  ruleGroup: string;
  statements: Statement[];
  displayName: string;
  image: string;
  statementHint: string;
  statementName: string;
  statementText: string;
  statementTemplate: string;
  columnCount: number;
  source: string;
}>;

export type AnalysisGroup = Partial<{
  groupName: string;
  groupDisplayName: string;
  groupOrder: number;
  entries: AnalysisEntry[];
  statements: Statement[];
}>;

export type StylistResponse = Partial<{
  video: string;
  text: string;
  isStopConversation: boolean;
}>;

export type TaskResults = Partial<{
  stylistResponse: StylistResponse;
  categorisedProducts: {
    [key in keyof PRODUCT_CATEGORIES]?: Product[];
  };
  statements: Statement[];
  analysisEntries: AnalysisEntry[];
  analysisGroups: AnalysisGroup[];
}>;

export type TaskData = Partial<{
  stylistsTiers: string[];
  stylistsIds: string[];
  isSourcePrivateThread: boolean;
  mustUseChosenStylist: boolean;
  threadId: string;
  startText: string;
  originalStylistId: string;
  stylist: Stylist;
  user: User;
  userResponse: string;
  userResponseImages: string[];
}>;

export type TaskContext = Partial<{
  taskImage: string;
  taskTitle: string;
  taskDescription: string;
  contentTags: string[];
  categories: string[];
  forms: string[][];
  isBlocked: boolean;
  positionInCategory: number;
  stepName: string;
  homepageImage: string;
  floatWrapperImage: string;
  shortDescription: string;
  nextTask: Partial<{
    taskName: string;
    taskDescription: string;
  }>;
}>;

export type CdeTask = TaskContext &
  TaskData &
  Partial<{
    taskId: string;
    taskName: string;
    taskType: TASK_TYPE;
    tier: string;
    sourceTaskId: string;
    status: string;
    createdTimestamp: string;
    updatedTimestamp: string;
    receivedTimestamp: string;
    currentStepHumanName: string;
    currentStepName: string;
    taskResults: TaskResults;
  }>;

export type TaskRoute = Partial<{
  productType: string;
  taskName: string;
  displayName: string;
}>;

export type TaskUserAttributes = Partial<{
  firstName: string;
  lastName: string;
  profilePicture: string;
}>;

export type TaskDefinition = TaskContext &
  TaskData &
  Partial<{
    isRecommended: boolean;

    id: string;
    taskName: string;
    taskType: TASK_TYPE;
    displayName: string;
    tier: string;
  }>;
