import styled from 'styled-components';

export const StyledRulesExperienceComponent = styled.section`
  --descriptionHeight: 66px;
  --tagHeight: 32px;
  --gridGap: 16px;
  --buttonsBlockHeight: calc(48px + var(--gridGap));

  /* 
    adding two gridGaps 
    between each of three child elements 
  */
  --contentHeight: calc(
    var(--descriptionHeight) + var(--tagHeight) + var(--buttonsBlockHeight) +
      (2 * var(--gridGap))
  );

  /* 
    substract two gridGaps
    one actual gap, second is to add bottom padding  
  */
  --imageHeight: calc(
    var(--activeScreenHeight) - var(--contentHeight) - (2 * var(--gridGap))
  );

  width: 100%;
  height: var(--activeScreenHeight);

  padding: 0 16px var(--gridGap);

  display: grid;
  grid-template-columns: 100%;
  grid-gap: 16px;
  grid-template-rows:
    minmax(auto, var(--imageHeight))
    minmax(auto, var(--contentHeight));

  .image-block {
    height: var(--imageHeight);
  }

  div.content-block {
    width: 100%;
    height: var(--contentHeight);

    display: grid;
    grid-gap: 16px;
    grid-template-rows:
      var(--descriptionHeight) var(--tagHeight)
      var(--buttonsBlockHeight);
    grid-auto-flow: row;

    p {
      display: grid;
      place-items: center;

      text-align: center;

      /* Show only 3 lines of text */
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  div.tags-block {
    width: calc(100% + 32px);

    margin-left: -16px;
    padding: 0 16px;
    overflow-x: auto;

    display: grid;
    grid-auto-flow: column;
    justify-content: flex-start;
    grid-gap: 8px;

    /* 
      this is a hack to create extra space after the last list item, 
      so there will be some margin in the end of the scroll
      (8px width + 8px grid-gap)
    */
    &::after {
      content: '';
      width: 8px;
      display: block;
    }

    span {
      width: max-content;
      height: var(--tagHeight);

      padding: 8px;

      display: flex;
      align-items: center;
      justify-content: center;

      white-space: nowrap;
      text-transform: uppercase;
      color: var(--bluePrimary);

      border-radius: 24px;
      background-color: var(--blueLighter);
    }
  }

  div.buttons-block {
    width: 100%;
    height: var(--buttonsBlockHeight);

    align-content: end;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 0 8px;
  }
`;
