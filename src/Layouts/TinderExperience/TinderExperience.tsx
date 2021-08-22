import * as React from 'react';
import { useSprings } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import { useMachine } from '@xstate/react';
import { assign } from 'xstate';

/* Types */
import { RATE_OPTIONS, RatedItemData, CardProps, ControlsProps } from './types';

/* Helpers */
import { machine, MachineContext } from './machine';

/* Styles */
import {
  setIdleAnimationConfig,
  setDraggingAnimationConfig,
  setTriggeredSwipeAnimationConfig,
  setTriggeredClickAnimationConfig
} from './animations';
import {
  StyledTinderExperience,
  StyledCardsWrapper,
  StyledCard
} from './styles';

interface Props<T> {
  items: T[];
  disabled: boolean;
  renderComponent: (props: CardProps<T>) => JSX.Element;
  renderControls: (props: ControlsProps) => JSX.Element;
  onItemRate: (args: RatedItemData) => void;
  onUpdate?: (state: MachineContext) => void;
}

function TinderExperience<T>({
  items,
  disabled,
  renderComponent,
  renderControls,
  onItemRate,
  onUpdate
}: Props<T>): React.ReactElement<Props<T>> {
  const [springs, set] = useSprings(items.length, i => ({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  }));

  const [machineState, sendEvent, machineService] = useMachine<
    MachineContext,
    any
  >(machine, {
    actions: {
      onDrag: (context: MachineContext) => {
        setSpringAnimation(
          context.activeItemIndex,
          setDraggingAnimationConfig(context.gestureData)
        );
      },

      onRelease: (context: MachineContext) => {
        setSpringAnimation(
          context.activeItemIndex,
          setIdleAnimationConfig(context.gestureData)
        );
      },

      /*
        do not delete "assign" function or it will brake actions call order

        https://xstate.js.org/docs/guides/context.html#action-order
      */
      onSwipeTrigger: assign((context: MachineContext) => {
        onItemRate({
          index: context.activeItemIndex,
          rate: context.activeItemRate
        });

        setSpringAnimation(
          context.activeItemIndex,
          setTriggeredSwipeAnimationConfig(context.gestureData)
        );

        return context;
      }),

      onClickTrigger: assign((context: MachineContext) => {
        onItemRate({
          index: context.activeItemIndex,
          rate: context.activeItemRate
        });

        setSpringAnimation(
          context.activeItemIndex,
          setTriggeredClickAnimationConfig(context.gestureData)
        );

        return context;
      })
    }
  });

  /*
    Create a gesture
    we're interested in down-state,
    delta (current-pos - click-pos),
    direction and velocity
  */
  const bindEvents = useDrag(
    ({
      args: [itemIndex],
      down,
      movement: [mx, my],
      direction: [xDir, yDir],
      velocity
    }) => {
      /* Prevent any action if component is disabled */
      if (disabled) {
        return;
      }

      sendEvent({
        target: 'idle',
        type: 'SWIPE'
      });

      /* If you flick hard enough it should trigger the card to fly out  */
      const velocityTrigger = velocity > 0.2;

      /* Trigger if swipe distance more then 6/7 of the half of the screen */
      const distanceTrigger = Math.abs(mx) > (window.innerWidth / 2) * (6 / 7);

      /* Item is in an animation process (dragging) */
      if (down) {
        sendEvent({
          target: 'dragging',
          type: 'MOUSEDOWN',
          meta: {
            rate: defineItemRateValue(mx),
            gestureData: {
              mx,
              my
            }
          }
        });
        /* Item released and was not triggered */
      } else {
        if (!velocityTrigger && !distanceTrigger) {
          sendEvent({
            target: 'dragging',
            type: 'MOUSEUP',
            meta: {
              gestureData: {
                mx
              }
            }
          });
          /* Item released and was triggered */
        } else {
          sendEvent({
            target: 'dragging',
            type: 'TRIGGER',
            meta: {
              rate: defineItemRateValue(mx),
              gestureData: {
                /* Direction should either point left or right */
                xDirection: Math.sign(xDir),
                /* Direction should either point top or bottom */
                yDirection: Math.sign(yDir),
                mx,
                velocity
              }
            }
          });
        }
      }
    },
    { delay: 1000 }
  );

  /* component onUpdate */
  React.useEffect(() => {
    sendEvent({
      target: 'init',
      type: 'ITEMS_RECEIVED',
      meta: {
        itemsLength: items?.length ?? 0
      }
    });
  }, [items]);

  /* machine onUpdate */
  machineService.onTransition(state => {
    if (state.changed) {
      !!onUpdate && onUpdate(state.context);
    }
  });

  const setSpringAnimation = (
    activeSpringIndex: number,
    animationConfig: any
  ) => {
    // @ts-ignore
    set(springIndex => {
      if (activeSpringIndex !== springIndex) {
        /*
          We're only interested in changing spring-data for the current spring
        */
        return;
      }
      return animationConfig;
    });
  };

  const defineItemRateValue = React.useCallback((x: number): RATE_OPTIONS => {
    switch (Math.sign(x)) {
      /* Left */
      case -1:
        return RATE_OPTIONS.DISLIKE;
      /* Right */
      case 1:
        return RATE_OPTIONS.LIKE;
      /* Middle */
      case 0:
        return RATE_OPTIONS.INIT;
      default:
        break;
    }
  }, []);

  const handleControlClick = React.useCallback(
    (rate: RATE_OPTIONS) => {
      /* Prevent any action if component is disabled */
      if (disabled) {
        return;
      }

      sendEvent({
        target: 'idle',
        type: 'CLICK',
        meta: {
          rate,
          gestureData: {
            xDirection: rate === RATE_OPTIONS.LIKE ? 1 : -1,
            velocity: 0.2
          }
        }
      });
    },
    [disabled]
  );

  return (
    <StyledTinderExperience>
      <StyledCardsWrapper>
        {springs.map((springProps, i) => (
          <StyledCard
            key={i}
            isActive={i === machineState.context.activeItemIndex}
            {...bindEvents(i)}
            {...springProps}
          >
            {renderComponent({
              data: items[i],
              isDragging: machineState.value === 'dragging',
              rate:
                i === machineState.context.activeItemIndex
                  ? machineState.context.activeItemRate
                  : RATE_OPTIONS.INIT
            })}
          </StyledCard>
        ))}
      </StyledCardsWrapper>

      {renderControls({
        onClick: handleControlClick
      })}
    </StyledTinderExperience>
  );
}

export { TinderExperience };
