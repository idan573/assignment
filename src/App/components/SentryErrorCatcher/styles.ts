import styled from 'styled-components';

export const StyledSentryErrorCatcher = styled.div`
  width: 100%;
  height: var(--screenHeight);

  padding: 20px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const StyledTitle = styled.h1`
  margin: 3vh 0 2vh 0;
  font-family: var(--fr);
  font-size: 2.4rem;
  line-height: 29px;
  text-align: center;
  color: var(--blueDarker);
`;

export const StyledDescription = styled.p`
  width: 60%;

  margin: 0 0 2vh 0;

  font-family: var(--fl);
  font-size: 1.6rem;
  line-height: 20px;
  text-align: center;
  color: var(--blueDarker);
`;
