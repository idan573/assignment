export const userFragment = `{
  createdAt
  userId
  FirstName
  LastName
  firstName
  lastName
  ProfilePicture
  profilePic
  tasksCount
  uploadImages
  subscribedToService
  homePageStylist
  firstShowroomVistTime
  firstFreeStylingTaskTime
  isHaveActiveTask
  lastTaskSentTimestamp
  lastTaskId
  clientType
  email
  phoneNumber
  doneUIFlows
  utmSource
  isHaveActiveJourneyTask
  subscriptionTaskCap
  subscriptionTaskUsed
}`;

const mappedAttributeFragment = `{
  attributeName
  name
  value
}`;

const attributesByCategoryFragment = `{
  body ${mappedAttributeFragment}
  style ${mappedAttributeFragment}
  demography ${mappedAttributeFragment}
}`;

export const mappedAttributesFragment = `{
  attributesByCategory ${attributesByCategoryFragment}
}`;
