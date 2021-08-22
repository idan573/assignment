import { Machine, assign } from 'xstate';

import { RATE_OPTIONS } from './types';

export type GestureData = Partial<{
  mx: number;
  my: number;
  velocity: number;
  xDirection: number;
  yDirection: number;
}>;

export interface MachineContext {
  activeItemIndex: number;
  activeItemRate: RATE_OPTIONS;
  itemsLength: number;
  triggeredItems: Set<{ index: number; rate: RATE_OPTIONS }>;
  gestureData?: GestureData;
}

export const machine = Machine<MachineContext>(
  {
    id: 'tinder-experience-machine',
    initial: 'init',
    states: {
      init: {
        on: {
          ITEMS_RECEIVED: [
            {
              target: 'idle',
              actions: 'setItems',
              cond: 'itemsValid'
            },
            {
              target: '',
              actions: 'setItems'
            }
          ]
        }
      },
      idle: {
        on: {
          SWIPE: {
            target: 'dragging'
          },
          CLICK: {
            target: 'clickTriggered',
            actions: 'setTriggeredContext'
          }
        }
      },
      dragging: {
        on: {
          MOUSEDOWN: {
            actions: ['onDrag', 'setDraggingContext']
          },
          MOUSEUP: {
            target: 'idle',
            actions: ['onRelease', 'setIdleContext']
          },
          TRIGGER: {
            target: 'swipeTriggered',
            actions: 'setTriggeredContext'
          }
        }
      },
      swipeTriggered: {
        entry: ['onSwipeTrigger', 'setMachineIterationContext'],
        on: {
          '': [
            {
              target: 'done',
              cond: 'iterationInvalid'
            },
            {
              target: 'idle'
            }
          ]
        }
      },
      clickTriggered: {
        entry: ['onClickTrigger', 'setMachineIterationContext'],
        on: {
          '': [
            {
              target: 'done',
              cond: 'iterationInvalid'
            },
            {
              target: 'idle'
            }
          ]
        }
      },
      done: {
        type: 'final'
      }
    }
  },
  {
    actions: {
      setItems: assign((context: MachineContext, { meta }: any) => ({
        ...context,
        triggeredItems: new Set(),
        activeItemRate: RATE_OPTIONS.INIT,
        itemsLength: meta.itemsLength,
        activeItemIndex: meta.itemsLength - 1
      })),

      setIdleContext: assign((context: MachineContext, { meta }: any) => ({
        ...context,
        activeItemRate: RATE_OPTIONS.INIT,
        gestureData: meta.gestureData
      })),

      setDraggingContext: assign((context: MachineContext, { meta }: any) => ({
        ...context,
        activeItemRate: meta.rate,
        gestureData: meta.gestureData
      })),

      setTriggeredContext: assign((context: MachineContext, { meta }: any) => ({
        triggeredItems: context.triggeredItems.add({
          index: context.activeItemIndex,
          rate: meta.rate
        }),
        activeItemRate: meta.rate,
        gestureData: meta.gestureData
      })),

      setMachineIterationContext: assign((context: MachineContext) => ({
        ...context,
        activeItemIndex: context.activeItemIndex - 1,
        activeItemRate: RATE_OPTIONS.INIT
      }))
    },
    guards: {
      itemsValid: (context: MachineContext, { meta }: any) => !!meta.itemsLength,
      iterationInvalid: (context: MachineContext) =>
        context.triggeredItems.size >= context.itemsLength
    }
  }
);
