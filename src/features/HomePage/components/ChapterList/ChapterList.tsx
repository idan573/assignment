import * as React from 'react';
import splitEvery from 'ramda/src/splitEvery';
import { SwipeableViews } from '@bit/scalez.savvy-ui.swipeable-views';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { Chapter } from 'App/types';

/* Components */
import { ChapterPreview } from '../ChapterPreview/ChapterPreview';

/* Styles */
import { StyledChapterList } from './styles';

interface Props {
  chapters: Chapter[];
  onChapterClick: (chapter: Chapter) => void;
}

const maxWidth =
  +getComputedStyle(document.documentElement)
    .getPropertyValue('--maxWidth')
    .replace('px', '') || 500;

const width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth;

const ChapterList: React.FC<Props> = React.memo(
  ({ chapters = [], onChapterClick }: Props) => {
    return (
      <StyledChapterList>
        <SwipeableViews
          className="chapter-swipeable-views"
          width={width}
          renderControls={({
            activeViewIndex,
            viewsCount,
            changeViewIndex
          }) => (
            <div className="chapter-list-controls">
              <Button
                className="prev"
                data-type="simple-icon"
                data-form="rectangle"
                data-action="back"
                data-action-position="center"
                disabled={activeViewIndex === 0}
                onClick={() => {
                  changeViewIndex(activeViewIndex - 1);
                }}
              />
              <Button
                className="next"
                data-type="simple-icon"
                data-form="rectangle"
                data-action="next"
                data-action-position="center"
                disabled={activeViewIndex === viewsCount - 1}
                onClick={() => changeViewIndex(activeViewIndex + 1)}
              />
            </div>
          )}
        >
          {splitEvery(3, chapters)?.map((threeChapters, key) => (
            <div key={key} className="three-chapters-block">
              {threeChapters.map((chapter, key) => (
                <ChapterPreview
                  key={key}
                  className="chapter-preview"
                  chapter={chapter}
                  onClick={() => onChapterClick(chapter)}
                />
              ))}
            </div>
          ))}
        </SwipeableViews>
      </StyledChapterList>
    );
  }
);

export { ChapterList };
