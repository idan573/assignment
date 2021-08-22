import * as React from 'react';

/* Types */
import { Chapter, Step, STEP_STATUS, CHAPTER_STATUS } from 'App/types';

/* Styles */
import {
  StyledChapterPreview,
  StyledChapterImage,
  StyledRecommendedIcon
} from './styles';

type Props = {
  className?: string;
  chapter: Chapter;
  onClick?: () => void;
};

const ChapterPreview: React.FC<Props> = React.memo(
  ({ className, chapter = {}, onClick }: Props) => {
    const chapterProgress: number = React.useMemo(() => {
      const doneSteps = chapter.steps.filter(
        step => step.status === STEP_STATUS.DONE
      );

      return Math.round((doneSteps.length / chapter.steps.length) * 100);
    }, [chapter]);

    const chapterStatus: CHAPTER_STATUS = React.useMemo(() => {
      if (!chapter.steps.length) {
        return CHAPTER_STATUS.NONE;
      }

      if (
        chapter.steps[chapter.steps.length - 1]?.status === STEP_STATUS.READY
      ) {
        return CHAPTER_STATUS.NONE;
      }

      if (chapter.steps.every(step => step.status === STEP_STATUS.DONE)) {
        return CHAPTER_STATUS.DONE;
      }

      if (chapter.steps.every(step => step.status === STEP_STATUS.BLOCKED)) {
        return CHAPTER_STATUS.BLOCKED;
      }

      if (chapter.steps.some(step => step.status === STEP_STATUS.IN_PROGRESS)) {
        return CHAPTER_STATUS.IN_PROGRESS;
      }

      if (chapter.steps.some(step => step.status === STEP_STATUS.DONE)) {
        return CHAPTER_STATUS.CONTINUE;
      }

      return CHAPTER_STATUS.NONE;
    }, [chapter]);

    return (
      <StyledChapterPreview
        className={className}
        onClick={onClick}
        data-is-blocked={chapterStatus === CHAPTER_STATUS.BLOCKED}
      >
        <div
          className="progress-block"
          style={
            {
              '--progress': `${chapterProgress}%`
            } as React.CSSProperties
          }
        />

        <StyledChapterImage src={chapter.image} draggable="false" />

        <p className="chapter-name body-bold">{chapter.displayName}</p>

        {chapter.isRecommended && (
          <>
            <StyledRecommendedIcon />
            <p className="recommended-label body-bold">Recommended</p>
          </>
        )}
      </StyledChapterPreview>
    );
  }
);

export { ChapterPreview };
