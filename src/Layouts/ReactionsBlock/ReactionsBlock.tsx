import * as React from 'react';
import { FloatWrapper } from '@bit/scalez.savvy-ui.float-wrapper';

/* Styles */
import {
  StyledReactionsBlock,
  StyledReactionsList,
  StyledAngryReaction,
  StyledSadReaction,
  StyledOkReaction,
  StyledGoodReaction,
  StyledHappyReaction,
  StyledDescription,
  StyledNextButton
} from './styles';

enum REACTIONS_TYPES {
  ANGRY = 'ANGRY',
  SAD = 'SAD',
  OK = 'OK',
  GOOD = 'GOOD',
  HAPPY = 'HAPPY'
}

const reactionBasicMarkup = (
  <div>
    <svg className="eye left">
      <use xlinkHref="#eye" />
    </svg>
    <svg className="eye right">
      <use xlinkHref="#eye" />
    </svg>
    <svg className="mouth">
      <use xlinkHref="#mouth" />
    </svg>
  </div>
);

interface REACTION {
  type: REACTIONS_TYPES;
  component: JSX.Element;
}

interface Props {
  handleNextClick: (rate: number, rateType: REACTIONS_TYPES) => void;
}

interface State {
  type: REACTIONS_TYPES;
  rate: number;
}

const initState: State = {
  type: '' as REACTIONS_TYPES,
  rate: null
};

const reactions: REACTION[] = [
  {
    type: REACTIONS_TYPES.ANGRY,
    component: <StyledAngryReaction>{reactionBasicMarkup}</StyledAngryReaction>
  },
  {
    type: REACTIONS_TYPES.SAD,
    component: <StyledSadReaction>{reactionBasicMarkup}</StyledSadReaction>
  },
  {
    type: REACTIONS_TYPES.OK,
    component: (
      <StyledOkReaction>
        <div></div>
      </StyledOkReaction>
    )
  },
  {
    type: REACTIONS_TYPES.GOOD,
    component: <StyledGoodReaction>{reactionBasicMarkup}</StyledGoodReaction>
  },
  {
    type: REACTIONS_TYPES.HAPPY,
    component: (
      <StyledHappyReaction>
        <div>
          <svg className="eye left">
            <use xlinkHref="#eye" />
          </svg>
          <svg className="eye right">
            <use xlinkHref="#eye" />
          </svg>
        </div>
      </StyledHappyReaction>
    )
  }
];

const ReactionsBlock: React.FC<Props> = ({ handleNextClick }: Props) => {
  const [activeReaction, setActiveReaction] = React.useState<State>(initState);

  const reactionItems = React.useMemo(
    () =>
      reactions.map((reaction: REACTION, index: number) =>
        React.cloneElement(reaction.component, {
          key: index,
          className: activeReaction.type === reaction.type && 'active',
          onClick: () => handleReactionClick(reaction.type, index + 1)
        })
      ),
    [activeReaction, reactions]
  );

  const reactionMessage = React.useCallback(() => {
    switch (activeReaction.type) {
      case REACTIONS_TYPES.ANGRY:
        return 'very dissatisfied';
      case REACTIONS_TYPES.SAD:
        return 'somewhat dissatisfied';
      case REACTIONS_TYPES.OK:
        return 'neither satisfied nor dissatisfied';
      case REACTIONS_TYPES.GOOD:
        return 'somewhat satisfied';
      case REACTIONS_TYPES.HAPPY:
        return 'very satisfied';
      default:
        return '';
    }
  }, [activeReaction]);

  const handleReactionClick = React.useCallback(
    (type: REACTIONS_TYPES, rate: number) => {
      setActiveReaction((prevState: State) =>
        prevState.type === type ? initState : { type, rate }
      );
    },
    []
  );

  return (
    <>
      <StyledReactionsBlock>
        <StyledReactionsList>{...reactionItems}</StyledReactionsList>
        <StyledDescription>{reactionMessage()}</StyledDescription>
      </StyledReactionsBlock>

      <FloatWrapper
        render={!!activeReaction.type}
        position="bottom"
        transition="slide-bottom"
      >
        <StyledNextButton
          data-action="next"
          data-action-position="right"
          onClick={() =>
            handleNextClick(activeReaction.rate, activeReaction.type)
          }
        >
          Next
        </StyledNextButton>
      </FloatWrapper>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
          <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
        </symbol>
        <symbol
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 18 7"
          id="mouth"
        >
          <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
        </symbol>
      </svg>
    </>
  );
};

export { ReactionsBlock };
