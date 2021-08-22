import styled from 'styled-components';

export const StyledSwipeableViews = styled.div`
  position: relative;
`;

export const StyledDotsBlock = styled.div`
  width: 100%;
  margin: 10px 0;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledSwipeableDot = styled.span`
  width: 13px;
  height: 13px;

  margin: 0 2px;

  border-radius: 50%;
  border: 1px solid #ffffffe6;

  &[data-is-active='true'] {
    background-color: #0d0048cc;
  }

  &[data-is-active='false'] {
    background-color: #d6d6d6b3;
  }
`;
