import * as React from 'react';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { Chapter } from 'App/types';

/* Components */
import { ChapterTimeline } from '../ChapterTimeline/ChapterTimeline';
import { ChapterPreview } from '../ChapterPreview/ChapterPreview';

/* Styles */
import { StyledTabs } from './styles';

type Props = {
  activeChapterIndex?: number;
  chapters: Chapter[];
};

const ChapterTabs: React.FC<Props> = React.memo(
  ({ activeChapterIndex, chapters = [] }: Props) => {
    return (
      <StyledTabs
        activeIndex={activeChapterIndex}
        renderControls={({ activeTabIndex, tabsCount, changeTabIndex }) =>
          chapters.length > 1 && (
            <div className="chapter-tabs-controls">
              <Button
                className="prev"
                data-type="simple-icon"
                data-form="rectangle"
                data-action="back"
                data-action-position="center"
                disabled={activeTabIndex === 0}
                onClick={() => changeTabIndex(activeTabIndex - 1)}
              />
              <Button
                className="next"
                data-type="simple-icon"
                data-form="rectangle"
                data-action="next"
                data-action-position="center"
                disabled={activeTabIndex === tabsCount - 1}
                onClick={() => changeTabIndex(activeTabIndex + 1)}
              />
            </div>
          )
        }
      >
        {chapters.map((chapter, key) => (
          <div key={key} className="chapter-wrapper">
            {chapters.length > 1 && <ChapterPreview chapter={chapter} />}

            <p className="chapter-description body-bold">
              {chapter.description}
            </p>

            <ChapterTimeline chapter={chapter} />
          </div>
        ))}
      </StyledTabs>
    );
  }
);

export { ChapterTabs };
