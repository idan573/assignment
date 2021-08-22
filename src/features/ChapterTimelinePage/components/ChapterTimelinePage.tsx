import * as React from 'react';
import { useLocation, RouteComponentProps } from 'react-router-dom';

/* Types */
import { Level } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChapterTabs } from 'features/HomePage/components/ChapterTabs/ChapterTabs';

/* Styles */
import { StyledChapterTimelinePage } from './styles';

type LocationParams = {
  chapterName: string;
};

type LocationState = Partial<{
  level: Level;
}>;

type Props = RouteComponentProps<LocationParams, {}, LocationState>;

const ChapterTimelinePage: React.FC<Props> = ({
  location,
  match: { params }
}) => {
  const { state: locationState = {} } = useLocation<LocationState>();

  const {
    actions: { trackPage }
  } = React.useContext<RootContextType>(RootContext);

  React.useEffect(() => {
    trackPage({
      name: 'ChapterTimelinePage'
    });
  }, []);

  return (
    <StyledChapterTimelinePage>
      <h2>{locationState.level.displayName}</h2>

      <ChapterTabs
        activeChapterIndex={locationState.level?.chapters?.findIndex(
          c => c?.chapterName === params?.chapterName
        )}
        chapters={locationState.level?.chapters}
      />
    </StyledChapterTimelinePage>
  );
};

export default ChapterTimelinePage;
