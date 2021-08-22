import { HEADER_ITEM_TYPES } from '@bit/scalez.savvy-ui.header';

import { history } from 'App/components/App';

/* Utils */
import { lazyLoadFlowBuilderRoute } from 'core/utils';

/* Api */
import { provideProductsTypesQuery } from 'App/api/rulesExperience/provideProductsTypes';
import {
  GQLSuggestProductsVars,
  suggestProductsQuery
} from 'App/api/rulesExperience/suggestProducts';
import { suggestRulesQuery } from 'App/api/rulesExperience/suggestRules';
import { startRuleExperienceMutation } from 'App/api/rulesExperience/startRuleExperience';
import { setDefaultHeaderConfig } from 'App/components/headerConfig';

/* Types */
import {
  FlowConfig,
  FlowEventArgument,
  FlowStepConfig
} from 'FlowBuilder/types';
import { Product, Rule, User } from 'App/types';
import { BaseFlowState } from 'FlowBuilder/flows/baseFlow';

interface RulesExperienceState {
  productTypes: string[];
  attributes: { key: string; value: string }[];
  rulesIds: string[];
}

export type REFlowState = {
  categories: string[];
  selectedCategories: string[];
  attributes: { key: string; value: string }[];
  maxCategoriesCount: number;
  rules: Rule[];
  numberOfRules: number;
  sessionId: string;
  products: Product[];
  ruleIndex: number;
  experienceId: string;
  numberOfProducts: number;
  rulesIds?: string[];
} & BaseFlowState;

const initialProduct = {
  price: 0,
  productId: 0,
  brand: ''
};

/* Flow Functions */
function onStart(config: FlowEventArgument) {
  const { location } = config?.route;

  let productTypes = [];
  let attributes = [];
  let rulesIds = [];
  if (location?.state) {
    const locationState = location.state as RulesExperienceState;
    productTypes = locationState.productTypes;
    attributes = locationState.attributes;
    rulesIds = locationState?.rulesIds;
  }

  const setflowState = config?.actions?.setFlowState;

  setflowState({ categories: [] });

  if (attributes?.length || productTypes?.length) {
    setflowState({ selectedCategories: productTypes, attributes, rulesIds });
    return;
  }

  provideProductsTypesQuery({
    userType: 'savvy',
    isOnlyNames: true
  }).then(categories => {
    setflowState({ categories });
    startRuleExperienceMutation({ userId: config.state?.userData?.userId });
  });
}

function onCategoriesMoveNext(context: FlowEventArgument) {
  const {
    selectedCategories,
    numberOfRules,
    userData,
    attributes,
    rulesIds
  } = context.state as REFlowState;
  const { setFlowState } = context.actions;

  suggestRulesQuery({
    userId: userData?.userId ?? '',
    numberOfRules,
    productsTypes: selectedCategories,
    extraAttributes: attributes,
    rulesIds
  }).then(rules => {
    if (!rules && rules.length) {
      return;
    }
    const { sessionId, experienceId } = rules[0];
    console.log('session Id:', sessionId);
    console.log('experience Id', experienceId);

    setFlowState({ rules, sessionId, ruleIndex: 0 });
  });
}

async function onRulesExperieceMoveNext({
  state,
  actions: { setFlowState, onBack, onNext }
}: FlowEventArgument) {
  const {
    rules,
    ruleIndex,
    sessionId,
    experienceId,
    userData,
    numberOfProducts
  } = state as REFlowState;

  const currentRule = rules[ruleIndex];
  const suggestProductsVars: GQLSuggestProductsVars = {
    userId: userData.userId,
    ruleId: currentRule.ruleId,
    isAgree: true,
    experienceId,
    sessionId,
    numberOfProducts
  };

  let products;
  try {
    products = await suggestProductsQuery(suggestProductsVars);
  } catch (e) {
    console.log(e);
  }

  if (!!products?.length) {
    setFlowState({ products: [initialProduct, ...products.reverse()] });
    return;
  }

  /* Load products failed or empty and last rule */
  if (ruleIndex + 1 === rules.length) {
    onNext();
    return;
  }

  /* Load products failed or empty and continue to next rule */
  setFlowState({ ruleIndex: ruleIndex + 1 });

  console.log('Load product failed, going back');

  onBack();
}

/* Flow Steps */
const reSteps: FlowStepConfig[] = [
  {
    name: 'ChooseCategoriesPage',
    trackPage: true,
    component: lazyLoadFlowBuilderRoute('ChooseCategoriesStep'),
    onMoveNext: onCategoriesMoveNext,
    restricted: true,
    skip: config => {
      const state = config?.flowState['re'] as REFlowState;

      return !!state?.selectedCategories.length || !!state?.attributes.length;
    },
    headerConfig: [
      {
        type: HEADER_ITEM_TYPES.BUTTON,
        props: {
          ['data-action']: 'back',
          onClick: () => {
            history.push('/closet');
          }
        }
      }
    ]
  },
  {
    name: 'RulesExperiencePage',
    trackPage: true,
    component: lazyLoadFlowBuilderRoute('RulesExperienceStep'),
    onMoveNext: onRulesExperieceMoveNext,
    onMoveBack: context => {
      const { setFlowState } = context.actions;
      setFlowState({ rules: [] });
    },
    restricted: true,
    headerConfig: [
      {
        type: HEADER_ITEM_TYPES.BUTTON,
        props: {
          ['data-action']: 'back',
          onClick: () => {
            history.push('/closet');
          }
        }
      }
    ]
  },
  {
    name: 'ProductsExperiencePage',
    trackPage: true,
    component: lazyLoadFlowBuilderRoute('ProductsExperienceStep'),
    skip: ({ flowState }) => {
      const state = flowState['re'];

      if (state?.ruleIndex + 1 < state?.rules?.length) {
        return false;
      }
      return !state?.rules[state?.ruleIndex]?.isLiked;
    },
    headerConfig: setDefaultHeaderConfig()
  },
  {
    name: 'FeedbackPage',
    trackPage: true,
    component: lazyLoadFlowBuilderRoute('FeedbackStep')
  }
];

export const reFlow: FlowConfig<REFlowState> = {
  steps: reSteps,
  defaultState: {
    categories: [],
    selectedCategories: [],
    maxCategoriesCount: 3,
    numberOfRules: 6,
    rules: [],
    products: [],
    sessionId: '',
    ruleIndex: undefined,
    experienceId: '',
    attributes: [],
    numberOfProducts: 6
  },
  onStart,
  isRepeat: true
};
