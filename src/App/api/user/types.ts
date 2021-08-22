export type GQLUser = Partial<{
  createdAt: string;
  userId: string;
  FirstName: string;
  LastName: string;
  ProfilePicture: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  tasksCount: number;
  subscribedToService: boolean;
  homePageStylist: string;
  firstShowroomVistTime: string;
  firstFreeStylingTaskTime: string;
  isHaveActiveTask: boolean;
  isHaveActiveJourneyTask: boolean | string /* remove after fixed in backend */;
  lastTaskSentTimestamp: string;
  lastTaskId: string;
  clientType: string;
  email: string;
  phoneNumber: string;
  doneUIFlows: string[];
  utmSource: string;
  uploadImages: string[];
  subscriptionTaskUsed: number;
  subscriptionTaskCap: number;
}>;

export type GQLMappedAttribute = Partial<{
  attributeName: string;
  name: string;
  value: string;
}>;

export type GQLAttributesByCategory = Partial<{
  body: GQLMappedAttribute[];
  demography: GQLMappedAttribute[];
  profile: GQLMappedAttribute[];
  style: GQLMappedAttribute[];
}>;

export type GQLMappedAttributes = Partial<{
  attributes: GQLUser;
  attributesByCategory: GQLAttributesByCategory;
}>;
