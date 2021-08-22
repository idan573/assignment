/* Types */
import { GQLProduct } from 'App/api/closet/types';
import { GQLStylist } from 'App/api/stylist/types';

export type GQLAnalysisEntry = Partial<{
  entryName: string;
  attributeName: string;
  attributeValue: string;
  displayName: string;
  group: string;
  image: string;
  groupName: string;
  groupDisplayName: string;
  groupOrder: number;
}>;

export type GQLStatement = Partial<{
  name: string;
  displayName: string;
  statementText: string;
  answer: string;
  priority: number;
  image: string;
  type: 'image' | 'text';
  info: string;
  ruleGroup: string;
  rowSize: number;
  source: string;
}>;

export type GQLTaskRoute = Partial<{
  productType: string;
  taskName: string;
  displayName: string;
}>;

export type GQLTaskUserAttributes = Partial<{
  FirstName: string;
  LastName: string;
  ProfilePicture: string;
  firstName: string;
  lastName: string;
  profilePic: string;
}>;

export type GQLTaskStylistInfo = Partial<{
  stylistId: string;
  stylistImage: string;
  stylistFirstName: string;
  stylistLastName: string;
}>;

export type GQLTaskData = Partial<{
  stylistsTiers: string[];
  stylistsIds: string[];
  isSourcePrivateThread: boolean;
  mustUseChosenStylist: boolean;
  userId: string;
  threadId: string;
  startText: string;
  stylistId: string;
  originalStylistId: string;
  userAttributes: GQLTaskUserAttributes;
  taskImages: string[];
  stylist: GQLTaskStylistInfo;
  userResponse: string;
  userResponseImages: string[];
}>;

export type GQLTaskContext = Partial<{
  description: string;
  title: string;
  image: string;
  contentTags: string[];
  categories: string[];
  forms: string[][];
  nextTaskName: string;
  nextTaskDescription: string;
  isBlocked: boolean;
  positionInCategory: number;
  stepName: string;
  shortDescription: string;
  homepageImage: string;
  floatWrapperImage: string;
}>;

export type GQLStylistResponse = Partial<{
  video: string;
  text: string;
  isStopConversation: boolean;
}>;

export type GQLEdeTaskStyle = Partial<{
  products: GQLProduct[];
  flow: string;
  createTimestamp: string;
  styleId: string;
  stylistId: string;
  taskId: string;
}>;

export type GQLTaskResults = Partial<{
  stylistResponse: GQLStylistResponse;
  styles: GQLEdeTaskStyle[];
  statements: GQLStatement[];
  analysisEntries: GQLAnalysisEntry[];
}>;

export type GQLCdeTask = Partial<{
  taskId: string;
  taskName: string;
  taskType: string;
  tier: string;
  sourceTaskId: string;
  status: string;
  createdTimestamp: string;
  updatedTimestamp: string;
  receivedTimestamp: string;
  currentStepHumanName: string;
  currentStepName: string;
  taskData: GQLTaskData;
  taskContext: GQLTaskContext;
  taskResults: GQLTaskResults;
}>;

export type GQLTaskDefinition = Partial<{
  id: string;
  taskName: string;
  taskType: string;
  displayName: string;
  tier: string;
  taskContext: GQLTaskContext;
  taskData: GQLTaskData;
  stylist: GQLStylist;
}>;
