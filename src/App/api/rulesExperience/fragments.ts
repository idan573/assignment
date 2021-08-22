export const ruleFragment = `{
  ruleId
  ruleLongText
  ruleShortText
  image
  flow
  order
  probability
  isRandomProbability
  modelName
  position
  tags
  sessionId
  experienceId
}`;

export const ruleTipFragment = `{
  displayName
  image
  name
  priority
  productsTypes {
    name
  }
  rules {
    ruleId
  }
  attributes {
    key
    value
  }
}`;
