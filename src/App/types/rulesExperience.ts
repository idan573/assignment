export type Rule = Partial<{
  ruleId: string;
  ruleLongText: string;
  ruleShortText: string;
  image: string;
  flow: string;
  order: number;
  probability: number;
  isRandom: boolean;
  modelName: string;
  position: number;
  tags: string[];
  sessionId: string;
  experienceId: string;

  isLiked: boolean;
}>;

export type RuleTip = Partial<{
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
