import styled from 'styled-components';
import { Button } from '@bit/scalez.savvy-ui.button';

export const StyledReactionsBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledAngryReaction = styled.li`
  --step-1-rx: -24deg;
  --step-1-ry: 20deg;
  --step-2-rx: -24deg;
  --step-2-ry: -20deg;

  div {
    &:before {
      --r: 20deg;
    }

    &:after {
      --l: 23px;
      --r: -20deg;
    }

    svg {
      &.eye {
        stroke-dasharray: 4.55;
        stroke-dashoffset: 8.15;
      }
    }
  }

  &.active {
    animation: angry 1s linear;

    div {
      &:before {
        --middle-y: -2px;
        --middle-r: 22deg;

        animation: toggle 0.8s linear forwards;
      }

      &:after {
        --middle-y: 1px;
        --middle-r: -18deg;

        animation: toggle 0.8s linear forwards;
      }
    }
  }
`;

export const StyledSadReaction = styled.li`
  --step-1-rx: 20deg;
  --step-1-ry: -12deg;
  --step-2-rx: -18deg;
  --step-2-ry: 14deg;

  div {
    &:before,
    &:after {
      --b: var(--active-tear);
      --sc: 0;
      --w: 5px;
      --h: 5px;
      --t: 15px;
      --br: 50%;
    }

    &:after {
      --l: 25px;
    }

    svg {
      &.eye {
        --t: 16px;
      }

      &.mouth {
        --t: 24px;

        stroke-dasharray: 9.5;
        stroke-dashoffset: 33.25;
      }
    }
  }

  &.active {
    div {
      &:before,
      &:after {
        animation: tear 0.6s linear forwards;
      }
    }
  }
`;

export const StyledOkReaction = styled.li`
  --step-1-rx: 4deg;
  --step-1-ry: -22deg;
  --step-1-rz: 6deg;
  --step-2-rx: 4deg;
  --step-2-ry: 22deg;
  --step-2-rz: -6deg;

  div {
    &:before {
      --l: 12px;
      --t: 17px;
      --h: 4px;
      --w: 4px;
      --br: 50%;

      box-shadow: 12px 0 0 var(--e, var(--normal-eye));
    }

    &:after {
      --l: 13px;
      --t: 26px;
      --w: 14px;
      --h: 2px;
      --br: 1px;
      --b: var(--m, var(--normal-mouth));
    }
  }

  &.active {
    div {
      &:before {
        --middle-s-y: 0.35;

        animation: toggle 0.2s linear forwards;
      }

      &:after {
        --middle-s-x: 0.5;

        animation: toggle 0.7s linear forwards;
      }
    }
  }
`;

export const StyledGoodReaction = styled.li`
  --step-1-rx: -14deg;
  --step-1-rz: 10deg;
  --step-2-rx: 10deg;
  --step-2-rz: -8deg;

  div {
    &:before {
      --b: var(--m, var(--normal-mouth));
      --w: 5px;
      --h: 5px;
      --br: 50%;
      --t: 22px;
      --zi: 0;

      opacity: 0.5;
      box-shadow: 16px 0 0 var(--b);

      filter: blur(2px);
    }

    &:after {
      --sc: 0;
    }

    svg {
      &.eye {
        --t: 15px;
        --sc: -1;

        stroke-dasharray: 4.55;
        stroke-dashoffset: 8.15;
      }

      &.mouth {
        --t: 22px;
        --sc: -1;

        stroke-dasharray: 13.3;
        stroke-dashoffset: 23.75;
      }
    }
  }

  &.active {
    div {
      svg {
        &.mouth {
          --middle-y: 1px;
          --middle-s: -1;

          animation: toggle 0.8s linear forwards;
        }
      }
    }
  }
`;

export const StyledHappyReaction = styled.li`
  div {
    --step-1-rx: 18deg;
    --step-1-ry: 24deg;
    --step-2-rx: 18deg;
    --step-2-ry: -24deg;

    &:before {
      --sc: 0;
    }

    &:after {
      --b: var(--m, var(--normal-mouth));
      --l: 11px;
      --t: 23px;
      --w: 18px;
      --h: 8px;
      --br: 0 0 8px 8px;
    }

    svg {
      &.eye {
        --t: 14px;
        --sc: -1;
      }
    }
  }

  &.active {
    div {
      &:after {
        --middle-s-x: 0.95;
        --middle-s-y: 0.75;

        animation: toggle 0.8s linear forwards;
      }
    }
  }
`;

export const StyledReactionsList = styled.ul`
  --normal: #eceaf3;
  --normal-shadow: #d9d8e3;
  --normal-mouth: #9795a4;
  --normal-eye: #595861;
  --active: #f8da69;
  --active-shadow: #f4b555;
  --active-mouth: #f05136;
  --active-eye: #313036;
  --active-tear: #76b5e7;
  --active-shadow-angry: #e94f1d;

  height: 40px;

  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;

  justify-content: center;

  li {
    position: relative;

    border-radius: 50%;
    background: var(--sb, var(--normal));
    box-shadow: inset 3px -3px 4px var(--sh, var(--normal-shadow));

    transition: background 0.4s, box-shadow 0.4s, transform 0.3s;

    -webkit-tap-highlight-color: transparent;

    &:not(:last-child) {
      margin-right: 20px;
    }

    div {
      width: 40px;
      height: 40px;
      position: relative;

      transform: perspective(240px) translateZ(4px);

      svg,
      &:before,
      &:after {
        display: block;
        position: absolute;

        left: var(--l, 9px);
        top: var(--t, 13px);
        width: var(--w, 8px);
        height: var(--h, 2px);

        transform: rotate(var(--r, 0deg)) scale(var(--sc, 1)) translateZ(0);
      }
      svg {
        fill: none;
        stroke: var(--s);
        stroke-width: 2px;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: stroke 0.4s;

        &.eye {
          --s: var(--e, var(--normal-eye));
          --t: 17px;
          --w: 7px;
          --h: 4px;

          &.right {
            --l: 23px;
          }
        }

        &.mouth {
          --s: var(--m, var(--normal-mouth));
          --l: 11px;
          --t: 23px;
          --w: 18px;
          --h: 7px;
        }
      }

      &:before,
      &:after {
        content: '';
        z-index: var(--zi, 1);

        border-radius: var(--br, 1px);
        background: var(--b, var(--e, var(--normal-eye)));

        transition: background 0.4s;
      }
    }

    &:not(.active) {
      cursor: pointer;

      &:active {
        transform: scale(0.925);
      }
    }

    &.active {
      --sb: var(--active);
      --sh: var(--active-shadow);
      --m: var(--active-mouth);
      --e: var(--active-eye);

      div {
        animation: shake 0.8s linear forwards;
      }
    }
  }

  @keyframes shake {
    30% {
      transform: perspective(240px) rotateX(var(--step-1-rx, 0deg))
        rotateY(var(--step-1-ry, 0deg)) rotateZ(var(--step-1-rz, 0deg))
        translateZ(10px);
    }
    60% {
      transform: perspective(240px) rotateX(var(--step-2-rx, 0deg))
        rotateY(var(--step-2-ry, 0deg)) rotateZ(var(--step-2-rz, 0deg))
        translateZ(10px);
    }
    100% {
      transform: perspective(240px) translateZ(4px);
    }
  }

  @keyframes tear {
    0% {
      opacity: 0;
      transform: translateY(-2px) scale(0) translateZ(0);
    }
    50% {
      transform: translateY(12px) scale(0.6, 1.2) translateZ(0);
    }
    20%,
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(24px) translateX(4px) rotateZ(-30deg)
        scale(0.7, 1.1) translateZ(0);
    }
  }

  @keyframes toggle {
    50% {
      transform: translateY(var(--middle-y, 0))
        scale(
          var(--middle-s-x, var(--middle-s, 1)),
          var(--middle-s-y, var(--middle-s, 1))
        )
        rotate(var(--middle-r, 0deg));
    }
  }

  @keyframes angry {
    40% {
      background: var(--active);
    }
    45% {
      box-shadow: inset 3px -3px 4px var(--active-shadow),
        inset 0 8px 10px var(--active-shadow-angry);
    }
  }
`;

export const StyledDescription = styled.span`
  margin-top: 24px;

  font-size: 1.4rem;
  line-height: 17px;
  color: var(--blueDarker);
  text-align: center;
`;

export const StyledNextButton = styled(Button)`
  margin-top: auto;

  z-index: 1;
`;
