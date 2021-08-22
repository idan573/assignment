export enum CLIENT_TYPE {
  SAVVY = 'savvy',
  FOLLOWER = 'follower'
}

export type User = Partial<{
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  tasksCount: number;
  subscribedToService: boolean;
  homePageStylist: string;
  firstShowroomVistTime: string;
  firstFreeStylingTaskTime: string;
  isHaveActiveTask: boolean;
  lastTaskSentTimestamp: string;
  lastTaskId: string;
  createdAt: string;
  clientType: CLIENT_TYPE;
  email: string;
  phoneNumber: string;
  doneUIFlows: string[];
  utmSource: string;
  uploadImages: string[];
  isHaveActiveJourneyTask: boolean;
  subscriptionTaskUsed: number;
  subscriptionTaskCap: number;
}>;

export type UserAttribute = Partial<{
  attributeName: string;
  name: string;
  value: string;
}>;

export type UserAttributesByCategory = Partial<{
  body: UserAttribute[];
  demography: UserAttribute[];
  profile: UserAttribute[];
  style: UserAttribute[];
}>;

export type UserAttributes = Partial<{
  attributes: User;
  attributesByCategory: UserAttributesByCategory;
}>;
