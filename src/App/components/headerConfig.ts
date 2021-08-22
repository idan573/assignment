import { ButtonProps } from '@bit/scalez.savvy-ui.button';
import {
  HEADER_ITEM_TYPES,
  HEADER_ITEM_POSITION_TYPES,
  HEADER_ITEM_TEMPLATE_TYPES
} from '@bit/scalez.savvy-ui.header';

export const logoHeaderConfig = [
  {
    type: HEADER_ITEM_TYPES.LOGO,
    props: {
      dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER
    }
  }
];

export const setHeaderWithTitleConfig = (title: string) => [
  {
    type: HEADER_ITEM_TYPES.BUTTON,
    props: {
      ['data-action']: 'back'
    }
  },
  {
    type: HEADER_ITEM_TYPES.TITLE,
    props: {
      dataSelfPosition: HEADER_ITEM_POSITION_TYPES.LEFT,
      children: title
    }
  }
];

export const setDefaultHeaderConfig = (buttonProps: ButtonProps = {}) => [
  {
    type: HEADER_ITEM_TYPES.BUTTON,
    props: {
      ['data-action']: 'back',
      dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
      ...buttonProps
    }
  },
  {
    type: HEADER_ITEM_TYPES.LOGO,
    props: {
      dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER,

      /* Forcibly center logo with hardcoded value */
      style: {
        marginLeft: '-36px'
      }
    }
  }
];

export const setHeaderWidthMenuConfig = (buttonProps: ButtonProps = {}) => [
  {
    type: HEADER_ITEM_TYPES.BUTTON,
    props: {
      ['data-action']: 'back',
      dataGridTemplate: HEADER_ITEM_TEMPLATE_TYPES.MAX_CONTENT,
      ...buttonProps
    }
  },
  {
    type: HEADER_ITEM_TYPES.LOGO,
    props: {
      dataSelfPosition: HEADER_ITEM_POSITION_TYPES.CENTER
    }
  },
  {
    type: HEADER_ITEM_TYPES.BUTTON,
    props: {
      ['data-action']: 'menu',
      dataSelfPosition: HEADER_ITEM_POSITION_TYPES.RIGHT
    }
  }
];
