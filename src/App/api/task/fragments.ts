import { stylistFragment } from 'App/api/stylist/fragments';

export const taskRoute = `{
  productType
  taskName
  displayName
}`;

export const taskUserAttributesFragment = `{
  FirstName
  LastName
  ProfilePicture
  firstName
  lastName
  profilePic
}`;

export const taskStylistInfoFragment = `{
  stylistId
  stylistImage
  stylistFirstName
  stylistLastName
}`;

export const stylistResponseFragment = `{
  video
  text
  isStopConversation
}`;

export const edeTaskProductFragment = `{
  productType
  productId
  images
  position
  productCategory
  productLink
}`;

export const edeTaskStyleFragment = `{
  products ${edeTaskProductFragment}
  flow
  createTimestamp
  styleId
  stylistId
  taskId
}`;

export const statementFragment = `{
  name
  displayName
  statementText
  answer
  priority
  image
  type
  info
  ruleGroup
  rowSize
  source
}`;

export const analysisEntryFragment = `{
  entryName
  attributeName
  attributeValue
  displayName
  group
  image
  groupName
  groupDisplayName
  groupOrder
}`;

export const taskDataFragment = `{
  stylistsTiers
  stylistsIds
  isSourcePrivateThread
  mustUseChosenStylist
  userId
  threadId
  startText
  stylistId
  originalStylistId
  userAttributes ${taskUserAttributesFragment}
  taskImages
  stylist ${taskStylistInfoFragment}
  userResponse
  userResponseImages
}`;

export const taskContextFragment = `{
  description
  title
  image
  contentTags
  categories
  forms
  nextTaskName
  nextTaskDescription
  isBlocked
  positionInCategory
  stepName
  shortDescription
  homepageImage
  floatWrapperImage
  isRecommended
}`;

export const taskResultsFragment = `{
  stylistResponse ${stylistResponseFragment}
  styles ${edeTaskStyleFragment}
  statements ${statementFragment}
  analysisEntries ${analysisEntryFragment}
}`;

export const cdeTaskFragment = `{
  taskId
  taskName
  taskType
  tier
  sourceTaskId
  status
  createdTimestamp
  updatedTimestamp
  receivedTimestamp
  currentStepHumanName
  currentStepName
  taskData ${taskDataFragment}
  taskContext ${taskContextFragment}
  taskResults ${taskResultsFragment}
}`;

export const taskDefinitionFragment = `{
  id
  taskName
  taskType
  displayName
  tier
  taskContext ${taskContextFragment}
  taskData ${taskDataFragment}
  stylist ${stylistFragment}
}`;
