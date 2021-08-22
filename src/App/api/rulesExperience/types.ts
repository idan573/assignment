export type GQLRule = Partial<{
  ruleId: string;
  ruleLongText: string;
  ruleShortText: string;
  image: string;
  flow: string;
  order: number;
  probability: number;
  isRandomProbability: boolean;
  modelName: string;
  position: number;
  tags: string[];
  sessionId: string;
  experienceId: string;
}>;

export type GQLRuleTip = Partial<{
  displayName: string;
  image: string;
  name: string;
  priority: number;
  productsTypes: Partial<{
    name: string;
  }>[];
  rules: Partial<{
    ruleId: string;
  }>[];
  attributes: Partial<{
    key: string;
    value: string;
  }>[];
}>;
