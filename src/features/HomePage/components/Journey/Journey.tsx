import * as React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button } from '@bit/scalez.savvy-ui.button';

/* Types */
import { Journey, Level, Chapter } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChapterTimeline } from '../ChapterTimeline/ChapterTimeline';
import { ChapterTabs } from '../ChapterTabs/ChapterTabs';
import { ChapterList } from '../ChapterList/ChapterList';

/* Styles */
import { StyledJourney, StyledCheckIcon } from './styles';

interface Props {
  journey: Journey;
}

const maxWidth =
  +getComputedStyle(document.documentElement)
    .getPropertyValue('--maxWidth')
    .replace('px', '') || 500;

const width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth;

const Journey: React.FC<Props> = React.memo(
  ({ journey: { levels = [], userProgress = {} } }: Props) => {
    const location = useLocation();
    const history = useHistory();

    const {
      state: { userData, journeyInfo }
    } = React.useContext<RootContextType>(RootContext);

    const firstLevel = React.useMemo(() => levels[0] || {}, [levels]);
    const secondLevel = React.useMemo(() => levels[1] || {}, [levels]);

    const activeChapterIndex = React.useMemo(() => {
      const index =
        userProgress.currentChapter === 'chapter1' &&
        userProgress.currentLevel === 'level2'
          ? secondLevel.chapters?.findIndex(
              c =>
                c.chapterName ===
                levels.flatMap(l => l.chapters).find(c => c.isRecommended)
                  ?.chapterName
            )
          : secondLevel.chapters?.findIndex(
              c => c.chapterName === userProgress.currentChapter
            );

      return index < 0 ? 0 : index;
    }, [levels]);

    return (
      <>
        {!!levels?.length && (
          <StyledJourney>
            <div
              className="level-wrapper"
              data-is-done={userProgress.currentLevelIndex !== 0}
              onClick={() => {
                if (userProgress.currentLevelIndex === 0) {
                  return;
                }

                history.push({
                  pathname: `/chapter/${firstLevel?.chapters[0]?.chapterName}`,
                  search: location.search,
                  state: {
                    level: {
                      ...firstLevel,
                      displayName: `Level 1: ${firstLevel?.displayName}`
                    }
                  }
                });
              }}
            >
              <h2>{`Level 1: ${firstLevel.displayName}`}</h2>

              {userProgress.currentLevelIndex === 0 ? (
                <>
                  <p className="chapter-description body-bold">
                    {firstLevel?.chapters[0]?.description}
                  </p>

                  <ChapterTimeline chapter={firstLevel?.chapters[0]} />
                </>
              ) : (
                <StyledCheckIcon />
              )}
            </div>

            <div
              className="level-wrapper"
              data-is-blocked={userProgress.currentLevelIndex === 0}
            >
              <h2>{`Level 2: ${secondLevel.displayName}`}</h2>

              {userProgress.currentLevelIndex === 0 ? (
                <ChapterList
                  chapters={secondLevel.chapters}
                  onChapterClick={(chapter: Chapter) =>
                    history.push({
                      pathname: `/chapter/${chapter?.chapterName}`,
                      search: location.search,
                      state: {
                        level: {
                          ...secondLevel,
                          displayName: `Level 2: ${secondLevel?.displayName}`
                        }
                      }
                    })
                  }
                />
              ) : (
                <ChapterTabs
                  activeChapterIndex={activeChapterIndex}
                  chapters={secondLevel?.chapters}
                />
              )}
            </div>
          </StyledJourney>
        )}
      </>
    );
  }
);

export { Journey };
