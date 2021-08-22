import * as React from 'react';
import { useHistory } from 'react-router';
import { ChapterTimeline as UIChapterTimeline } from '@bit/scalez.savvy-ui.chapter-timeline';
import { Modal } from '@bit/scalez.savvy-ui.modal';
import { setQueryString } from '@bit/scalez.savvy-ui.utils';

/* Services */
import { EVENTS } from 'services/analyticsService';
import { authService } from 'services/authService';

/* Api */
import { getCdeTaskQuery } from 'App/api/task/getCdeTask';
import { getUserResultsQuery } from 'App/api/journey/getUserResults';

/* Types */
import { Chapter, Step, STEP_STATUS, STEP_TYPE } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';

/* Styles */
import { StyledModal, StyledLockIcon, StyledClockIcon } from './styles';

type Props = {
  chapter: Chapter;
};

const ChapterTimeline: React.FC<Props> = React.memo(
  ({ chapter = {} }: Props) => {
    const history = useHistory();

    const {
      state: { userData, journeyInfo },
      actions: { trackEvent }
    } = React.useContext<RootContextType>(RootContext);

    const [isBlockedStepModalActive, toggleBlockedStepModal] = React.useState<
      boolean
    >(false);

    const [isAwaitStepModalActive, toggleAwaitStepModalActive] = React.useState<
      boolean
    >(false);

    const [changeChapterModalData, toggleChangeChapterModal] = React.useState<
      Partial<{
        isActive: boolean;
        step: Step;
      }>
    >({
      isActive: false,
      step: {}
    });

    const setLocationSearch = React.useCallback((step: Step) => {
      const searchParams = new URLSearchParams(location.search);

      return setQueryString({
        stepName: step.stepName,
        userId: searchParams.get('userId') || searchParams.get('id')
      });
    }, []);

    const startStep = React.useCallback((step: Step) => {
      trackEvent({
        event: EVENTS.JOURNEY_STARTED_TASK_CLICKED,
        properties: {
          ...step
        }
      });

      switch (step.stepType) {
        case STEP_TYPE.TASK:
          history.push({
            pathname: `/task-overview/${step.actionKey}`,
            search: setLocationSearch(step)
          });
          break;

        case STEP_TYPE.FORM:
          history.push({
            pathname: `/form-chat/${step.actionKey}`,
            search: setLocationSearch(step)
          });
          break;

        case STEP_TYPE.TASK_ROUTE:
          history.push({
            pathname: `/task-routing-step/overview/${step.stepName}`,
            search: setLocationSearch(step)
          });
          break;
      }
    }, []);

    const onStepReadyClick = React.useCallback(
      async (step: Step) => {
        if (!step.actionKey) {
          console.log('cant start style, actionKey is undefined');
          return;
        }

        if (!userData?.userId || !(await authService.isAuthenticated())) {
          await authService.login();
          return;
        }

        if (userData?.isHaveActiveJourneyTask) {
          toggleAwaitStepModalActive(true);
          return;
        }

        /* TODO: make sure this condition is correct */
        if (
          journeyInfo?.userProgress?.currentChapter !== step.chapter &&
          journeyInfo?.userProgress?.currentLevel !== 'level1' &&
          !!journeyInfo?.recommendedChapterName
        ) {
          toggleChangeChapterModal({
            isActive: true,
            step
          });
          return;
        }

        startStep(step);
      },
      [journeyInfo]
    );

    const onStepInProgressClick = React.useCallback(
      (step: Step, threadId: string) => {
        if (!threadId) {
          console.log('cant open step history');
          return;
        }

        trackEvent({
          event: EVENTS.JOURNEY_IN_PROGRESS_TASK_CLICKED,
          properties: {
            ...step,
            threadId
          }
        });

        switch (step.stepType) {
          case STEP_TYPE.TASK:
          case STEP_TYPE.TASK_ROUTE:
            history.push({
              pathname: `/styleups/thread/${threadId}`,
              search: setLocationSearch(step)
            });
            break;
          case STEP_TYPE.FORM:
            /* Retake form */
            history.push({
              pathname: `/form-chat/${step.actionKey}`,
              search: setLocationSearch(step)
            });
            break;
        }
      },
      []
    );

    const onStepDoneClick = React.useCallback(
      (step: Step, taskId: string, threadId: string) => {
        if (!taskId) {
          console.log('cant open step results');
          return;
        }

        trackEvent({
          event: EVENTS.JOURNEY_DONE_TASK_CLICKED,
          properties: {
            ...step,
            taskId
          }
        });

        switch (step.stepType) {
          case STEP_TYPE.TASK:
          case STEP_TYPE.TASK_ROUTE:
            history.push({
              pathname: threadId
                ? `/styleups/thread/${threadId}`
                : `/task-result/task/${taskId}`,
              search: setLocationSearch(step)
            });
            break;
          case STEP_TYPE.FORM:
            /* Retake form */
            history.push({
              pathname: `/form-chat/${step.actionKey}`,
              search: setLocationSearch(step)
            });
            break;
        }
      },
      []
    );

    const onStepClick = React.useCallback(
      async (step: Step) => {
        if (
          step.status === STEP_STATUS.BLOCKED ||
          step.status === STEP_STATUS.NONE
        ) {
          toggleBlockedStepModal(true);
          return;
        }

        if (step.status === STEP_STATUS.READY) {
          onStepReadyClick(step);
          return;
        }

        if (step.stepType === STEP_TYPE.FORM) {
          onStepReadyClick(step);
          return;
        }

        const stepsResults = await getUserResultsQuery({
          userId: userData?.userId,
          stepName: step.stepName
        });
        const result = stepsResults.find(
          data => data.stepName === step.stepName
        );

        if (step.status === STEP_STATUS.DONE) {
          onStepDoneClick(step, result.taskId, result.threadId);
          return;
        }

        const task = await getCdeTaskQuery({ taskId: result.taskId });
        onStepInProgressClick(step, task.threadId);
      },
      [chapter.steps, journeyInfo]
    );

    const changeChapterModalActions = React.useMemo(
      () => [
        {
          ['data-type']: 'secondary' as const,
          children: 'Cancel',
          onClick: () => toggleChangeChapterModal({ isActive: false })
        },
        {
          ['data-type']: 'primary' as const,
          children: 'Start',
          onClick: () => startStep(changeChapterModalData.step)
        }
      ],
      [changeChapterModalData]
    );

    return (
      <>
        <Modal
          name="change-chapter-modal"
          render={changeChapterModalData.isActive}
          title={`Are you sure you want to switch to "${chapter?.displayName}"?`}
          message={`Your stylist recommended you complete "${journeyInfo?.recommendedChapterName}" first.`}
          actions={changeChapterModalActions}
          onClickOutside={() => toggleChangeChapterModal({ isActive: false })}
        />

        <StyledModal
          name="blocked-step-modal"
          render={isBlockedStepModalActive}
          message={
            <>
              <StyledLockIcon />
              This step is locked because it comes later in this journey. Keep
              going to unlock it.
            </>
          }
          onClickOutside={() => toggleBlockedStepModal(false)}
        />

        <StyledModal
          name="await-step-modal"
          render={isAwaitStepModalActive}
          message={
            <>
              <StyledClockIcon />
              Your stylist is currently still working on a task. Check back in a
              bit!
            </>
          }
          onClickOutside={() => toggleAwaitStepModalActive(false)}
        />

        <UIChapterTimeline
          userData={{
            firstName: userData?.firstName ?? '',
            profilePicture: userData?.profilePicture ?? ''
          }}
          steps={chapter.steps}
          onClick={onStepClick}
          onUserStepClick={() =>
            history.push({
              pathname: '/user-profile'
            })
          }
        />
      </>
    );
  }
);

export { ChapterTimeline };
