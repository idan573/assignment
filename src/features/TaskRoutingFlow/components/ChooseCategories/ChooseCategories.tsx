import * as React from 'react';
import { RouteComponentProps } from 'react-router';

/* Api */
import { getContentTaskQuery } from 'App/api/task/getContentTask';

/* Types */
import { TaskRoute } from 'App/types';

/* Components */
import { RootContext, RootContextType } from 'App/components';
import { ChooseCategoriesComponent } from 'features/ChooseCategoriesPage/components/ChooseCategoriesComponent';

const ChooseCategories: React.FC<RouteComponentProps> = ({ history }) => {
  const {
    state: {
      journeyInfo: { activeStepInfo }
    }
  } = React.useContext<RootContextType>(RootContext);

  const categories = React.useMemo(() => {
    return (
      activeStepInfo?.routes.map((route: TaskRoute) => route.productType) ?? []
    );
  }, [activeStepInfo]);

  const [activeCategories, setActiveCategories] = React.useState<string[]>([]);

  const handleNextClick = React.useCallback(async () => {
    const activeRoute = activeStepInfo?.routes.find(
      route => route?.productType === activeCategories[0]
    );

    /* For now, lets skip this check for better performance
    const taskContent = await getContentTaskQuery({
      taskName: activeRoute?.taskName
    });
    
    if (taskContent?.forms.length > 0) {
      history.push({
        pathname: `/task-chat/${activeRoute?.taskName}`,
        search: location.search
      });
      return;
    }

    history.push({ pathname: '/homepage' });
    */

    history.push({
      pathname: `/task-chat/${activeRoute?.taskName}`,
      search: location.search
    });
  }, [activeStepInfo, activeCategories]);

  return (
    <>
      <ChooseCategoriesComponent
        handleNextClick={handleNextClick}
        categories={categories}
        activeCategories={activeCategories}
        setActiveCategories={setActiveCategories}
        maxCategoriesCount={1}
      />
    </>
  );
};

export default ChooseCategories;
