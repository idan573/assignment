import * as React from 'react';
import { Loader } from '@bit/scalez.savvy-ui.loader';

/* Api */
import {
  GQLReportRuleDecisionVars,
  reportRuleDecisionMutation
} from 'App/api/rulesExperience/reportRuleDecisions';

/* Context */
import { FlowContext, FlowContextType } from 'FlowBuilder/FlowProvider';

/* Component */
import { RulesExperienceComponent } from 'features/RulesExperiencePage/components/RulesExperienceComponent';

/* Types */
import { FlowRouteProps } from 'FlowBuilder/types';
import { REFlowState } from 'FlowBuilder/flows/reFlow';

const RulesExperienceStep: React.FC<FlowRouteProps> = React.memo(
  ({ currentFlowState, onNext, userData }: FlowRouteProps) => {
    const reFlowState = currentFlowState as REFlowState;
    const {
      actions: { setFlowState }
    } = React.useContext<FlowContextType>(FlowContext);

    const handleNextClick = React.useCallback(
      (isLiked: boolean) => {
        const updatedRules = [...reFlowState?.rules];

        updatedRules[reFlowState.ruleIndex].isLiked = isLiked;

        const currentRule = updatedRules[reFlowState.ruleIndex];

        setFlowState({
          rules: updatedRules,
          experienceId: currentRule.experienceId
        });

        /* Report Rule Decision */
        const ruleDecision: GQLReportRuleDecisionVars = {
          userId: userData?.userId,
          position: currentRule.position,
          order: currentRule.order,
          ruleId: currentRule.ruleId,
          modelName: currentRule.modelName,
          probability: currentRule.probability,
          sessionId: currentRule.sessionId,
          isRandomProbability: currentRule.isRandom,
          isAgree: currentRule.isLiked,
          experienceId: currentRule.experienceId
        };

        reportRuleDecisionMutation(ruleDecision).then(() =>
          console.log('report rule decision', {
            isAgree: currentRule.isLiked
          })
        );

        if (
          !currentRule.isLiked &&
          reFlowState.ruleIndex + 1 < reFlowState.rules?.length
        ) {
          setFlowState({
            rules: updatedRules,
            ruleIndex: reFlowState.ruleIndex + 1
          });
          return;
        }

        onNext();
      },
      [currentFlowState]
    );

    return (
      <>
        {currentFlowState?.rules.length > 0 ? (
          <RulesExperienceComponent
            rule={reFlowState?.rules[reFlowState.ruleIndex]}
            onRateClick={handleNextClick}
          />
        ) : (
          <Loader />
        )}
      </>
    );
  }
);

export default RulesExperienceStep;
